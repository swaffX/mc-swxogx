package com.server.playerstats;

import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.Location;
import org.bukkit.entity.Player;
import org.bukkit.scoreboard.*;

public class HUDManager {
    
    private final PlayerStatsHUD plugin;
    
    public HUDManager(PlayerStatsHUD plugin) {
        this.plugin = plugin;
    }
    
    public void updateHUD(Player player) {
        ScoreboardManager manager = Bukkit.getScoreboardManager();
        Scoreboard scoreboard = manager.getNewScoreboard();
        
        // Başlık
        String title = ChatColor.translateAlternateColorCodes('&', 
            plugin.getConfig().getString("hud.title", "&6&l⚡ OYUNCU BİLGİ"));
        
        Objective objective = scoreboard.registerNewObjective(
            "playerstats", 
            "dummy", 
            title
        );
        objective.setDisplaySlot(DisplaySlot.SIDEBAR);
        
        int line = 15;
        
        // Üst çizgi
        addLine(objective, ChatColor.GRAY + "━━━━━━━━━━━━━━━", line--);
        addLine(objective, " ", line--);
        
        // Can
        if (plugin.getConfig().getBoolean("modules.health", true)) {
            String healthColor = ChatColor.translateAlternateColorCodes('&',
                plugin.getConfig().getString("colors.health", "&c"));
            String labelColor = ChatColor.translateAlternateColorCodes('&',
                plugin.getConfig().getString("colors.label", "&7"));
            
            double health = player.getHealth();
            double maxHealth = player.getMaxHealth();
            String healthBar = createBar(health, maxHealth, 10);
            
            addLine(objective, labelColor + "❤ Can:", line--);
            addLine(objective, healthColor + " " + healthBar + " " + 
                String.format("%.0f/%.0f", health, maxHealth), line--);
            addLine(objective, "  ", line--);
        }
        
        // Açlık
        if (plugin.getConfig().getBoolean("modules.hunger", true)) {
            String hungerColor = ChatColor.translateAlternateColorCodes('&',
                plugin.getConfig().getString("colors.hunger", "&e"));
            String labelColor = ChatColor.translateAlternateColorCodes('&',
                plugin.getConfig().getString("colors.label", "&7"));
            
            int hunger = player.getFoodLevel();
            String hungerBar = createBar(hunger, 20, 10);
            
            addLine(objective, labelColor + "🍖 Açlık:", line--);
            addLine(objective, hungerColor + " " + hungerBar + " " + hunger + "/20", line--);
            addLine(objective, "   ", line--);
        }
        
        // XP
        if (plugin.getConfig().getBoolean("modules.xp", true)) {
            String xpColor = ChatColor.translateAlternateColorCodes('&',
                plugin.getConfig().getString("colors.xp", "&a"));
            String labelColor = ChatColor.translateAlternateColorCodes('&',
                plugin.getConfig().getString("colors.label", "&7"));
            
            int level = player.getLevel();
            float xpProgress = player.getExp();
            String xpBar = createBar(xpProgress * 100, 100, 10);
            
            addLine(objective, labelColor + "✨ XP:", line--);
            addLine(objective, xpColor + " Level " + level + " (" + 
                String.format("%.0f", xpProgress * 100) + "%)", line--);
            addLine(objective, xpColor + " " + xpBar, line--);
            addLine(objective, "    ", line--);
        }
        
        // Konum
        if (plugin.getConfig().getBoolean("modules.location", true)) {
            String locColor = ChatColor.translateAlternateColorCodes('&',
                plugin.getConfig().getString("colors.location", "&b"));
            String labelColor = ChatColor.translateAlternateColorCodes('&',
                plugin.getConfig().getString("colors.label", "&7"));
            
            Location loc = player.getLocation();
            String biome = loc.getBlock().getBiome().toString()
                .replace("_", " ").toLowerCase();
            biome = biome.substring(0, 1).toUpperCase() + biome.substring(1);
            
            addLine(objective, labelColor + "📍 Konum:", line--);
            addLine(objective, locColor + " X:" + loc.getBlockX() + 
                " Y:" + loc.getBlockY() + " Z:" + loc.getBlockZ(), line--);
            addLine(objective, locColor + " 🌲 " + biome, line--);
            addLine(objective, "     ", line--);
        }
        
        // Oynama Süresi
        if (plugin.getConfig().getBoolean("modules.playtime", true)) {
            String timeColor = ChatColor.translateAlternateColorCodes('&',
                plugin.getConfig().getString("colors.playtime", "&d"));
            String labelColor = ChatColor.translateAlternateColorCodes('&',
                plugin.getConfig().getString("colors.label", "&7"));
            
            long playtime = plugin.getPlaytime(player);
            String playtimeStr = formatTime(playtime);
            
            addLine(objective, labelColor + "⏱ Oynama Süresi:", line--);
            addLine(objective, timeColor + " " + playtimeStr, line--);
            addLine(objective, "      ", line--);
        }
        
        // Dünya Zamanı
        if (plugin.getConfig().getBoolean("modules.world-time", true)) {
            String worldTimeColor = ChatColor.translateAlternateColorCodes('&',
                plugin.getConfig().getString("colors.world-time", "&f"));
            String labelColor = ChatColor.translateAlternateColorCodes('&',
                plugin.getConfig().getString("colors.label", "&7"));
            
            long worldTime = player.getWorld().getTime();
            int hours = (int) ((worldTime / 1000 + 6) % 24);
            int minutes = (int) ((worldTime % 1000) * 60 / 1000);
            String timeString = String.format("%02d:%02d", hours, minutes);
            
            String period = getTimePeriod(hours);
            
            addLine(objective, labelColor + "🕐 Dünya Zamanı:", line--);
            addLine(objective, worldTimeColor + " " + timeString + " " + period, line--);
        }
        
        // Alt çizgi
        addLine(objective, "       ", line--);
        addLine(objective, ChatColor.GRAY + "━━━━━━━━━━━━━━━", line--);
        
        player.setScoreboard(scoreboard);
    }
    
    public void removeHUD(Player player) {
        player.setScoreboard(Bukkit.getScoreboardManager().getNewScoreboard());
    }
    
    private void addLine(Objective objective, String text, int score) {
        Score line = objective.getScore(text);
        line.setScore(score);
    }
    
    private String createBar(double current, double max, int length) {
        int filled = (int) ((current / max) * length);
        StringBuilder bar = new StringBuilder();
        
        for (int i = 0; i < length; i++) {
            if (i < filled) {
                bar.append("█");
            } else {
                bar.append("░");
            }
        }
        
        return bar.toString();
    }
    
    private String formatTime(long millis) {
        long seconds = millis / 1000;
        long minutes = seconds / 60;
        long hours = minutes / 60;
        
        seconds %= 60;
        minutes %= 60;
        
        if (hours > 0) {
            return String.format("%ds %ddk", hours, minutes);
        } else if (minutes > 0) {
            return String.format("%ddk %dsn", minutes, seconds);
        } else {
            return String.format("%dsn", seconds);
        }
    }
    
    private String getTimePeriod(int hours) {
        if (hours >= 6 && hours < 12) {
            return ChatColor.YELLOW + "☀ Sabah";
        } else if (hours >= 12 && hours < 18) {
            return ChatColor.GOLD + "☀ Öğleden Sonra";
        } else if (hours >= 18 && hours < 21) {
            return ChatColor.DARK_PURPLE + "🌙 Akşam";
        } else {
            return ChatColor.DARK_BLUE + "🌙 Gece";
        }
    }
}
