package com.server.timehud;

import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.Location;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitRunnable;
import org.bukkit.scoreboard.*;
import net.md_5.bungee.api.ChatMessageType;
import net.md_5.bungee.api.chat.TextComponent;

import java.util.*;

public class TimeHUD extends JavaPlugin implements Listener {
    
    private HashMap<UUID, Boolean> hudEnabled = new HashMap<>();
    private Set<String> developers = new HashSet<>();
    
    // Config değerleri
    private String hudTitle;
    private int hudUpdateInterval;
    private int compassUpdateInterval;
    private boolean enabledByDefault;
    private String joinMessage;
    private String devJoinMessage;
    private String welcomeTitle;
    private String welcomeSubtitle;
    private String welcomeActionbar;
    
    @Override
    public void onEnable() {
        // Config dosyasını oluştur/yükle
        saveDefaultConfig();
        loadConfiguration();
        
        getLogger().info("TimeHUD plugin enabled!");
        getServer().getPluginManager().registerEvents(this, this);
        
        TimeHUDCommand cmdExecutor = new TimeHUDCommand(this);
        getCommand("timehud").setExecutor(cmdExecutor);
        getCommand("timehud").setTabCompleter(cmdExecutor);
        
        // Scoreboard HUD
        new BukkitRunnable() {
            @Override
            public void run() {
                for (Player player : Bukkit.getOnlinePlayers()) {
                    if (isHUDEnabled(player)) {
                        updateHUD(player);
                    }
                }
            }
        }.runTaskTimer(this, 0L, hudUpdateInterval);
        
        // Koordinat ve pusula
        new BukkitRunnable() {
            @Override
            public void run() {
                for (Player player : Bukkit.getOnlinePlayers()) {
                    if (isHUDEnabled(player)) {
                        updateCompass(player);
                    }
                }
            }
        }.runTaskTimer(this, 0L, compassUpdateInterval);
    }
    
    public void loadConfiguration() {
        FileConfiguration config = getConfig();
        
        // HUD ayarları
        enabledByDefault = config.getBoolean("hud.enabled-by-default", true);
        hudTitle = ChatColor.translateAlternateColorCodes('&', 
            config.getString("hud.title", "&6&l⚡ SWXOQX ⚡"));
        hudUpdateInterval = config.getInt("hud.update-interval", 20);
        compassUpdateInterval = config.getInt("hud.compass-update-interval", 5);
        
        // Mesajlar
        joinMessage = ChatColor.translateAlternateColorCodes('&',
            config.getString("messages.join-message", "&a{player} sunucuya katıldı!"));
        devJoinMessage = ChatColor.translateAlternateColorCodes('&',
            config.getString("messages.developer-join-message", "&c⚡ Geliştirici &b{player} &7sunucuya katıldı!"));
        welcomeTitle = ChatColor.translateAlternateColorCodes('&',
            config.getString("messages.welcome-title", "&6★ &fHoş Geldin &6★"));
        welcomeSubtitle = ChatColor.translateAlternateColorCodes('&',
            config.getString("messages.welcome-subtitle", "&aİyi oyunlar!"));
        welcomeActionbar = ChatColor.translateAlternateColorCodes('&',
            config.getString("messages.welcome-actionbar", "&e⚡ &fSWXOQX Sunucusuna Hoş Geldin! &e⚡"));
        
        // Geliştiriciler
        developers.clear();
        List<String> devList = config.getStringList("developers");
        for (String dev : devList) {
            developers.add(dev.toLowerCase());
        }
        
        getLogger().info("Configuration loaded! Developers: " + developers.size());
    }
    
    @Override
    public void onDisable() {
        getLogger().info("TimeHUD plugin disabled!");
        for (Player player : Bukkit.getOnlinePlayers()) {
            removeHUD(player);
        }
    }
    
    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        Player player = event.getPlayer();
        String playerName = player.getName();
        boolean isDev = developers.contains(playerName.toLowerCase());
        
        event.setJoinMessage(null);
        Bukkit.broadcastMessage("");
        if (isDev) {
            Bukkit.broadcastMessage("  " + devJoinMessage.replace("{player}", playerName));
        } else {
            Bukkit.broadcastMessage("  " + joinMessage.replace("{player}", playerName));
        }
        Bukkit.broadcastMessage("");
        
        new BukkitRunnable() {
            int tick = 0;
            @Override
            public void run() {
                if (tick == 0) {
                    player.sendTitle(
                        welcomeTitle,
                        ChatColor.AQUA + playerName,
                        10, 40, 10
                    );
                } else if (tick == 3) {
                    player.sendTitle("", welcomeSubtitle, 0, 30, 20);
                } else if (tick >= 5) {
                    cancel();
                }
                tick++;
            }
        }.runTaskTimer(this, 0L, 20L);
        
        // Tek seferlik action bar - 3 saniye sonra
        new BukkitRunnable() {
            @Override
            public void run() {
                player.spigot().sendMessage(ChatMessageType.ACTION_BAR, 
                    new TextComponent(welcomeActionbar));
            }
        }.runTaskLater(this, 80L);
    }
    
    public boolean isHUDEnabled(Player player) {
        return hudEnabled.getOrDefault(player.getUniqueId(), enabledByDefault);
    }
    
    public void setHUDEnabled(Player player, boolean enabled) {
        hudEnabled.put(player.getUniqueId(), enabled);
        if (!enabled) removeHUD(player);
    }
    
    private void updateHUD(Player player) {
        ScoreboardManager manager = Bukkit.getScoreboardManager();
        Scoreboard scoreboard = manager.getNewScoreboard();
        
        Objective objective = scoreboard.registerNewObjective(
            "timehud", 
            Criteria.DUMMY,
            hudTitle
        );
        objective.setDisplaySlot(DisplaySlot.SIDEBAR);
        objective.numberFormat(io.papermc.paper.scoreboard.numbers.NumberFormat.blank());
        
        long worldTime = player.getWorld().getTime();
        int hours = (int) ((worldTime / 1000 + 6) % 24);
        int minutes = (int) ((worldTime % 1000) * 60 / 1000);
        String timeString = String.format("%02d:%02d", hours, minutes);
        
        String nextPeriod;
        int minutesUntilNext;
        
        if (hours >= 6 && hours < 12) {
            nextPeriod = "Öğleden Sonra";
            minutesUntilNext = (12 - hours - 1) * 60 + (60 - minutes);
        } else if (hours >= 12 && hours < 18) {
            nextPeriod = "Akşam";
            minutesUntilNext = (18 - hours - 1) * 60 + (60 - minutes);
        } else if (hours >= 18 && hours < 21) {
            nextPeriod = "Gece";
            minutesUntilNext = (21 - hours - 1) * 60 + (60 - minutes);
        } else {
            nextPeriod = "Sabah";
            if (hours >= 21) {
                minutesUntilNext = (24 - hours + 6 - 1) * 60 + (60 - minutes);
            } else {
                minutesUntilNext = (6 - hours - 1) * 60 + (60 - minutes);
            }
        }
        
        int nextHours = minutesUntilNext / 60;
        int nextMins = minutesUntilNext % 60;
        String countdown = String.format("%dsa %ddk", nextHours, nextMins);
        
        String period;
        if (hours >= 6 && hours < 12) {
            period = ChatColor.YELLOW + "☀ Sabah";
        } else if (hours >= 12 && hours < 18) {
            period = ChatColor.GOLD + "☀ Öğleden Sonra";
        } else if (hours >= 18 && hours < 21) {
            period = ChatColor.LIGHT_PURPLE + "☽ Akşam";
        } else {
            period = ChatColor.DARK_PURPLE + "☾ Gece";
        }
        
        int onlinePlayers = Bukkit.getOnlinePlayers().size();
        int maxPlayers = Bukkit.getMaxPlayers();
        
        String playerName = player.getName();
        boolean isDev = developers.contains(playerName.toLowerCase());
        String roleLabel = isDev ? ChatColor.RED + "Geliştirici" : ChatColor.WHITE + "Oyuncu";
        String nameColor = isDev ? ChatColor.AQUA.toString() : ChatColor.GREEN.toString();
        
        int score = 12;
        
        setScore(objective, ChatColor.DARK_GRAY + "▬▬▬▬▬▬▬▬▬▬▬▬▬", score--);
        setScore(objective, " ", score--);
        setScore(objective, roleLabel + ": " + nameColor + playerName, score--);
        setScore(objective, "  ", score--);
        setScore(objective, ChatColor.WHITE + "Saat: " + ChatColor.AQUA + timeString, score--);
        setScore(objective, ChatColor.WHITE + "Dönem: " + period, score--);
        setScore(objective, "   ", score--);
        setScore(objective, ChatColor.GRAY + "▸ " + nextPeriod + ": " + ChatColor.YELLOW + countdown, score--);
        setScore(objective, "    ", score--);
        setScore(objective, ChatColor.WHITE + "Oyuncular: " + ChatColor.GREEN + onlinePlayers + ChatColor.GRAY + "/" + maxPlayers, score--);
        setScore(objective, "     ", score--);
        setScore(objective, ChatColor.DARK_GRAY + "▬▬▬▬▬▬▬▬▬▬▬▬▬▬", score--);
        
        player.setScoreboard(scoreboard);
    }
    
    private void setScore(Objective objective, String text, int score) {
        objective.getScore(text).setScore(score);
    }
    
    private void removeHUD(Player player) {
        player.setScoreboard(Bukkit.getScoreboardManager().getNewScoreboard());
    }
    
    private void updateCompass(Player player) {
        // Koordinatlar
        int x = player.getLocation().getBlockX();
        int y = player.getLocation().getBlockY();
        int z = player.getLocation().getBlockZ();
        
        // Yön hesapla
        float yaw = player.getLocation().getYaw();
        yaw = (yaw % 360 + 360) % 360; // 0-360 arası normalize et
        
        String direction;
        String arrow;
        
        if (yaw >= 337.5 || yaw < 22.5) {
            direction = "Güney";
            arrow = "⬇";
        } else if (yaw >= 22.5 && yaw < 67.5) {
            direction = "Güneybatı";
            arrow = "⬋";
        } else if (yaw >= 67.5 && yaw < 112.5) {
            direction = "Batı";
            arrow = "⬅";
        } else if (yaw >= 112.5 && yaw < 157.5) {
            direction = "Kuzeybatı";
            arrow = "⬉";
        } else if (yaw >= 157.5 && yaw < 202.5) {
            direction = "Kuzey";
            arrow = "⬆";
        } else if (yaw >= 202.5 && yaw < 247.5) {
            direction = "Kuzeydoğu";
            arrow = "⬈";
        } else if (yaw >= 247.5 && yaw < 292.5) {
            direction = "Doğu";
            arrow = "➡";
        } else {
            direction = "Güneydoğu";
            arrow = "⬊";
        }
        
        String compassText = ChatColor.YELLOW + arrow + " " + ChatColor.WHITE + direction + 
                            ChatColor.DARK_GRAY + " | " + 
                            ChatColor.RED + "X:" + ChatColor.WHITE + x + " " +
                            ChatColor.GREEN + "Y:" + ChatColor.WHITE + y + " " +
                            ChatColor.AQUA + "Z:" + ChatColor.WHITE + z;
        
        player.spigot().sendMessage(ChatMessageType.ACTION_BAR, new TextComponent(compassText));
    }
}
