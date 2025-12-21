const { Client, GatewayIntentBits, EmbedBuilder, ActivityType, SlashCommandBuilder, REST, Routes, PermissionFlagsBits } = require('discord.js');
const { GameDig } = require('gamedig');
const fs = require('fs');
const path = require('path');
const net = require('net');
const config = require('./config.json');

// Config dosyasını kaydet
function saveConfig() {
    const configPath = path.join(__dirname, 'config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

// RCON Client
class RconClient {
    constructor(host, port, password) {
        this.host = host;
        this.port = port;
        this.password = password;
        this.requestId = 0;
    }

    async send(command) {
        return new Promise((resolve, reject) => {
            const socket = new net.Socket();
            socket.setTimeout(5000);
            
            socket.connect(this.port, this.host, () => {
                const authPacket = this.createPacket(this.requestId++, 3, this.password);
                socket.write(authPacket);
            });

            let authenticated = false;
            socket.on('data', (data) => {
                if (!authenticated) {
                    authenticated = true;
                    const cmdPacket = this.createPacket(this.requestId++, 2, command);
                    socket.write(cmdPacket);
                } else {
                    const length = data.readInt32LE(0);
                    const responseData = data.slice(12, 12 + length - 10).toString('utf8');
                    socket.destroy();
                    resolve(responseData);
                }
            });

            socket.on('timeout', () => { socket.destroy(); reject(new Error('Timeout')); });
            socket.on('error', (err) => { reject(err); });
        });
    }

    createPacket(id, type, body) {
        const bodyBuffer = Buffer.from(body, 'utf8');
        const length = 10 + bodyBuffer.length;
        const buffer = Buffer.alloc(4 + length);
        buffer.writeInt32LE(length, 0);
        buffer.writeInt32LE(id, 4);
        buffer.writeInt32LE(type, 8);
        bodyBuffer.copy(buffer, 12);
        buffer.writeInt16LE(0, 12 + bodyBuffer.length);
        return buffer;
    }
}

const rcon = new RconClient(config.minecraft.host, config.minecraft.rconPort || 25575, config.minecraft.rconPassword || 'SwxOgx2024Rcon!');

// Token environment variable'dan al
const TOKEN = process.env.DISCORD_TOKEN || '';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Oyuncu takibi
let lastPlayers = new Set();
let serverOnline = false;
let lastServerStatus = true; // Çöküş bildirimi için

// Slash komutları
const commands = [
    new SlashCommandBuilder()
        .setName('durum')
        .setDescription('Minecraft sunucu durumunu gösterir'),
    new SlashCommandBuilder()
        .setName('oyuncular')
        .setDescription('Online oyuncuları listeler'),
    new SlashCommandBuilder()
        .setName('ip')
        .setDescription('Sunucu IP adresini gösterir'),
    new SlashCommandBuilder()
        .setName('sunucu')
        .setDescription('Detaylı sunucu bilgisi (TPS, uptime, versiyon)'),
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Sunucu bağlantı testi'),
    new SlashCommandBuilder()
        .setName('devlog')
        .setDescription('Geliştirici log mesajı gönderir')
        .addStringOption(option =>
            option.setName('mesaj')
                .setDescription('Log mesajı')
                .setRequired(true)),
    new SlashCommandBuilder()
        .setName('kanalayarla')
        .setDescription('Bot kanal ID\'lerini ayarlar')
        .addStringOption(option =>
            option.setName('tip')
                .setDescription('Kanal tipi')
                .setRequired(true)
                .addChoices(
                    { name: 'Giriş/Çıkış Log', value: 'log' },
                    { name: 'Devlog', value: 'devlog' },
                    { name: 'Sunucu Durumu', value: 'status' }
                ))
        .addChannelOption(option =>
            option.setName('kanal')
                .setDescription('Hedef kanal')
                .setRequired(true)),
    new SlashCommandBuilder()
        .setName('whitelist')
        .setDescription('Whitelist yönetimi')
        .addStringOption(option =>
            option.setName('islem')
                .setDescription('İşlem türü')
                .setRequired(true)
                .addChoices(
                    { name: 'Ekle', value: 'add' },
                    { name: 'Çıkar', value: 'remove' },
                    { name: 'Liste', value: 'list' }
                ))
        .addStringOption(option =>
            option.setName('oyuncu')
                .setDescription('Oyuncu adı')
                .setRequired(false)),
    new SlashCommandBuilder()
        .setName('yardim')
        .setDescription('Bot komutlarını gösterir')
].map(cmd => cmd.toJSON());

// Bot hazır olduğunda
client.once('ready', async () => {
    console.log(`✅ ${client.user.tag} aktif!`);
    
    // Komutları kaydet - her sunucuya ayrı ayrı (anında güncellenir)
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    try {
        // Önce global komutları temizle (eski komutlar kaldırılsın)
        await rest.put(Routes.applicationCommands(config.clientId), { body: [] });
        
        // Her sunucuya guild komutları olarak kaydet (anında güncellenir)
        for (const guild of client.guilds.cache.values()) {
            await rest.put(
                Routes.applicationGuildCommands(config.clientId, guild.id),
                { body: commands }
            );
            console.log(`✅ Komutlar ${guild.name} sunucusuna yüklendi`);
        }
        console.log('✅ Tüm slash komutları yüklendi');
    } catch (error) {
        console.error('Komut yükleme hatası:', error);
    }
    
    // Durum güncelleme döngüsü
    updateStatus();
    setInterval(updateStatus, 30000); // 30 saniyede bir
    
    // Oyuncu giriş/çıkış kontrolü
    checkPlayers();
    setInterval(checkPlayers, 15000); // 15 saniyede bir
});

// Sunucu durumunu güncelle
async function updateStatus() {
    try {
        const state = await GameDig.query({
            type: 'minecraft',
            host: config.minecraft.host,
            port: config.minecraft.port
        });
        
        serverOnline = true;
        const playerCount = state.players.length;
        const maxPlayers = state.maxplayers;
        
        // Sunucu tekrar açıldıysa bildir
        if (!lastServerStatus && config.statusChannelId) {
            const statusChannel = client.channels.cache.get(config.statusChannelId);
            if (statusChannel) {
                const embed = new EmbedBuilder()
                    .setColor(0x00FF00)
                    .setTitle('🟢 Sunucu Tekrar Açıldı!')
                    .setDescription('Minecraft sunucusu tekrar çevrimiçi.')
                    .setTimestamp();
                statusChannel.send({ embeds: [embed] });
            }
        }
        lastServerStatus = true;
        
        client.user.setPresence({
            activities: [{
                name: `${playerCount}/${maxPlayers} oyuncu`,
                type: ActivityType.Playing
            }],
            status: playerCount > 0 ? 'online' : 'idle'
        });
    } catch (error) {
        serverOnline = false;
        
        // Sunucu çöktüyse bildir
        if (lastServerStatus && config.statusChannelId) {
            const statusChannel = client.channels.cache.get(config.statusChannelId);
            if (statusChannel) {
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('🔴 Sunucu Çevrimdışı!')
                    .setDescription('Minecraft sunucusu çevrimdışı oldu. Yöneticiler bilgilendirildi.')
                    .setTimestamp();
                statusChannel.send({ embeds: [embed] });
            }
        }
        lastServerStatus = false;
        
        client.user.setPresence({
            activities: [{
                name: 'Sunucu çevrimdışı',
                type: ActivityType.Watching
            }],
            status: 'dnd'
        });
    }
}

// Oyuncu giriş/çıkış kontrolü
async function checkPlayers() {
    if (!config.logChannelId) return;
    
    try {
        const state = await GameDig.query({
            type: 'minecraft',
            host: config.minecraft.host,
            port: config.minecraft.port
        });
        
        const currentPlayers = new Set(state.players.map(p => p.name));
        const logChannel = client.channels.cache.get(config.logChannelId);
        
        if (!logChannel) return;
        
        // Yeni girenler
        for (const player of currentPlayers) {
            if (!lastPlayers.has(player)) {
                const embed = new EmbedBuilder()
                    .setColor(0x00FF00)
                    .setTitle('🟢 Oyuncu Katıldı')
                    .setDescription(`**${player}** sunucuya katıldı!`)
                    .setTimestamp()
                    .setFooter({ text: `Online: ${currentPlayers.size} oyuncu` });
                
                await logChannel.send({ embeds: [embed] });
            }
        }
        
        // Çıkanlar
        for (const player of lastPlayers) {
            if (!currentPlayers.has(player)) {
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('🔴 Oyuncu Ayrıldı')
                    .setDescription(`**${player}** sunucudan ayrıldı.`)
                    .setTimestamp()
                    .setFooter({ text: `Online: ${currentPlayers.size} oyuncu` });
                
                await logChannel.send({ embeds: [embed] });
            }
        }
        
        lastPlayers = currentPlayers;
    } catch (error) {
        // Sunucu çevrimdışı
    }
}

// Slash komut işleyici
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    const { commandName } = interaction;
    
    if (commandName === 'durum') {
        await interaction.deferReply();
        
        try {
            const state = await GameDig.query({
                type: 'minecraft',
                host: config.minecraft.host,
                port: config.minecraft.port
            });
            
            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('🎮 SWXOQX Sunucu Durumu')
                .setThumbnail('https://mc-api.net/v3/server/favicon/' + config.minecraft.host)
                .addFields(
                    { name: '📊 Durum', value: '🟢 Çevrimiçi', inline: true },
                    { name: '👥 Oyuncular', value: `${state.players.length}/${state.maxplayers}`, inline: true },
                    { name: '🏷️ Sürüm', value: state.version || 'Bilinmiyor', inline: true },
                    { name: '📍 IP', value: `\`${config.minecraft.host}:${config.minecraft.port}\``, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: 'SWXOQX Minecraft' });
            
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('🎮 SWXOQX Sunucu Durumu')
                .addFields(
                    { name: '📊 Durum', value: '🔴 Çevrimdışı', inline: true }
                )
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
        }
    }
    
    else if (commandName === 'oyuncular') {
        await interaction.deferReply();
        
        try {
            const state = await GameDig.query({
                type: 'minecraft',
                host: config.minecraft.host,
                port: config.minecraft.port
            });
            
            const playerList = state.players.length > 0 
                ? state.players.map(p => `• ${p.name}`).join('\n')
                : 'Şu an kimse online değil';
            
            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle('👥 Online Oyuncular')
                .setDescription(playerList)
                .setFooter({ text: `Toplam: ${state.players.length}/${state.maxplayers}` })
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await interaction.editReply('❌ Sunucuya bağlanılamadı.');
        }
    }
    
    else if (commandName === 'ip') {
        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle('🌐 Sunucu Bilgileri')
            .addFields(
                { name: '📍 Sunucu Adresi', value: '`swxogx.mooo.com`', inline: false }
            )
            .setFooter({ text: 'TLauncher 1.21.10 ile giriş yapabilirsiniz!' });
        
        await interaction.reply({ embeds: [embed] });
    }
    
    else if (commandName === 'devlog') {
        const mesaj = interaction.options.getString('mesaj');
        const devChannel = client.channels.cache.get(config.devLogChannelId);
        
        if (!devChannel) {
            return interaction.reply({ content: '❌ Dev log kanalı ayarlanmamış!', ephemeral: true });
        }
        
        const embed = new EmbedBuilder()
            .setColor(0x9B59B6)
            .setTitle('📝 Geliştirici Logu')
            .setDescription(mesaj)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();
        
        await devChannel.send({ embeds: [embed] });
        await interaction.reply({ content: '✅ Dev log gönderildi!', ephemeral: true });
    }
    
    else if (commandName === 'yardim') {
        const embed = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle('📚 Bot Komutları')
            .addFields(
                { name: '/durum', value: 'Sunucu durumunu gösterir', inline: true },
                { name: '/oyuncular', value: 'Online oyuncuları listeler', inline: true },
                { name: '/ip', value: 'Sunucu IP adresini gösterir', inline: true },
                { name: '/sunucu', value: 'Detaylı sunucu bilgisi', inline: true },
                { name: '/ping', value: 'Bağlantı testi', inline: true },
                { name: '/whitelist', value: 'Whitelist yönetimi', inline: true },
                { name: '/devlog', value: 'Geliştirici logu gönderir', inline: true },
                { name: '/kanalayarla', value: 'Kanal ID\'lerini ayarlar', inline: true },
                { name: '/yardim', value: 'Bu mesajı gösterir', inline: true }
            )
            .setFooter({ text: 'SWXOQX Discord Bot' });
        
        await interaction.reply({ embeds: [embed] });
    }
    
    else if (commandName === 'sunucu') {
        await interaction.deferReply();
        
        try {
            const state = await GameDig.query({
                type: 'minecraft',
                host: config.minecraft.host,
                port: config.minecraft.port
            });
            
            // TPS al (RCON)
            let tpsInfo = 'Bilinmiyor';
            try {
                const tpsResponse = await rcon.send('tps');
                const match = tpsResponse.match(/(\d+\.?\d*),\s*(\d+\.?\d*),\s*(\d+\.?\d*)/);
                if (match) {
                    tpsInfo = `1m: ${match[1]} | 5m: ${match[2]} | 15m: ${match[3]}`;
                }
            } catch (e) {}
            
            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('🖥️ Detaylı Sunucu Bilgisi')
                .setThumbnail('https://mc-api.net/v3/server/favicon/' + config.minecraft.host)
                .addFields(
                    { name: '📊 Durum', value: '🟢 Çevrimiçi', inline: true },
                    { name: '👥 Oyuncular', value: `${state.players.length}/${state.maxplayers}`, inline: true },
                    { name: '🏷️ Sürüm', value: state.version || 'Bilinmiyor', inline: true },
                    { name: '⚡ TPS', value: tpsInfo, inline: false },
                    { name: '🎮 Oyun Modu', value: 'Survival', inline: true },
                    { name: '📍 IP', value: `\`swxogx.mooo.com\``, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'SWXOQX Minecraft' });
            
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('🖥️ Detaylı Sunucu Bilgisi')
                .setDescription('❌ Sunucu çevrimdışı veya erişilemiyor.')
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
        }
    }
    
    else if (commandName === 'ping') {
        const start = Date.now();
        await interaction.deferReply();
        
        try {
            await GameDig.query({
                type: 'minecraft',
                host: config.minecraft.host,
                port: config.minecraft.port
            });
            
            const ping = Date.now() - start;
            const status = ping < 100 ? '🟢 Mükemmel' : ping < 200 ? '🟡 İyi' : '🔴 Yavaş';
            
            const embed = new EmbedBuilder()
                .setColor(ping < 100 ? 0x00FF00 : ping < 200 ? 0xFFFF00 : 0xFF0000)
                .setTitle('🏓 Bağlantı Testi')
                .addFields(
                    { name: '📶 Ping', value: `${ping}ms`, inline: true },
                    { name: '📊 Durum', value: status, inline: true }
                )
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('🏓 Bağlantı Testi')
                .setDescription('❌ Sunucuya bağlanılamadı!')
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
        }
    }
    
    else if (commandName === 'whitelist') {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ Bu komutu kullanmak için yönetici yetkisine sahip olmalısın!', ephemeral: true });
        }
        
        const islem = interaction.options.getString('islem');
        const oyuncu = interaction.options.getString('oyuncu');
        
        await interaction.deferReply();
        
        try {
            if (islem === 'list') {
                const response = await rcon.send('whitelist list');
                const embed = new EmbedBuilder()
                    .setColor(0x5865F2)
                    .setTitle('📋 Whitelist')
                    .setDescription(response || 'Whitelist boş')
                    .setTimestamp();
                
                await interaction.editReply({ embeds: [embed] });
            } else if (islem === 'add' && oyuncu) {
                const response = await rcon.send(`whitelist add ${oyuncu}`);
                const embed = new EmbedBuilder()
                    .setColor(0x00FF00)
                    .setTitle('✅ Whitelist Güncellendi')
                    .setDescription(`**${oyuncu}** whitelist'e eklendi.\n\`${response}\``)
                    .setTimestamp();
                
                await interaction.editReply({ embeds: [embed] });
            } else if (islem === 'remove' && oyuncu) {
                const response = await rcon.send(`whitelist remove ${oyuncu}`);
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('🗑️ Whitelist Güncellendi')
                    .setDescription(`**${oyuncu}** whitelist'ten çıkarıldı.\n\`${response}\``)
                    .setTimestamp();
                
                await interaction.editReply({ embeds: [embed] });
            } else {
                await interaction.editReply('❌ Oyuncu adı gerekli!');
            }
        } catch (error) {
            await interaction.editReply('❌ RCON bağlantısı kurulamadı: ' + error.message);
        }
    }
    
    else if (commandName === 'kanalayarla') {
        // Yetki kontrolü - sadece yöneticiler kullanabilir
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ Bu komutu kullanmak için yönetici yetkisine sahip olmalısın!', ephemeral: true });
        }
        
        const tip = interaction.options.getString('tip');
        const kanal = interaction.options.getChannel('kanal');
        
        if (tip === 'log') {
            config.logChannelId = kanal.id;
            saveConfig();
            
            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('✅ Giriş/Çıkış Log Kanalı Ayarlandı')
                .setDescription(`Oyuncu giriş/çıkış logları artık <#${kanal.id}> kanalına gönderilecek.`)
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
        } else if (tip === 'devlog') {
            config.devLogChannelId = kanal.id;
            saveConfig();
            
            const embed = new EmbedBuilder()
                .setColor(0x9B59B6)
                .setTitle('✅ Devlog Kanalı Ayarlandı')
                .setDescription(`Geliştirici logları artık <#${kanal.id}> kanalına gönderilecek.`)
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
        } else if (tip === 'status') {
            config.statusChannelId = kanal.id;
            saveConfig();
            
            const embed = new EmbedBuilder()
                .setColor(0x3498DB)
                .setTitle('✅ Durum Kanalı Ayarlandı')
                .setDescription(`Sunucu durum bildirimleri artık <#${kanal.id}> kanalına gönderilecek.`)
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
        }
    }
});

// Botu başlat
client.login(TOKEN);
