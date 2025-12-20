package com.server.timehud;

import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.entity.Player;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitRunnable;
import org.bukkit.scoreboard.*;

import java.util.HashMap;
import java.util.UUID;

public class TimeHUD extends JavaPlugin {
    
    private HashMap<UUID, Boolean> hudEnabled = new HashMap<>();
    
    @Override
    public void onEnable() {
        getLogger().info("TimeHUD plugin enabled!");
        
        // Register command
        getCommand("timehud").setExecutor(new TimeHUDCommand(this));
        
        // Start HUD update task (runs every second)
        new BukkitRunnable() {
            @Override
            public void run() {
                for (Player player : Bukkit.getOnlinePlayers()) {
                    if (isHUDEnabled(player)) {
                        updateHUD(player);
                    }
                }
            }
        }.runTaskTimer(this, 0L, 20L); // 20 ticks = 1 second
    }
    
    @Override
    public void onDisable() {
        getLogger().info("TimeHUD plugin disabled!");
        
        // Remove scoreboards
        for (Player player : Bukkit.getOnlinePlayers()) {
            removeHUD(player);
        }
    }
    
    public boolean isHUDEnabled(Player player) {
        return hudEnabled.getOrDefault(player.getUniqueId(), true);
    }
    
    public void setHUDEnabled(Player player, boolean enabled) {
        hudEnabled.put(player.getUniqueId(), enabled);
        if (!enabled) {
            removeHUD(player);
        }
    }
    
    private void updateHUD(Player player) {
        ScoreboardManager manager = Bukkit.getScoreboardManager();
        Scoreboard scoreboard = manager.getNewScoreboard();
        
        Objective objective = scoreboard.registerNewObjective(
            "timehud", 
            "dummy", 
            ChatColor.GOLD + "" + ChatColor.BOLD + "⏰ SUNUCU BİLGİ"
        );
        objective.setDisplaySlot(DisplaySlot.SIDEBAR);
        
        // Get world time
        long worldTime = player.getWorld().getTime();
        int hours = (int) ((worldTime / 1000 + 6) % 24);
        int minutes = (int) ((worldTime % 1000) * 60 / 1000);
        
        // Format time
        String timeString = String.format("%02d:%02d", hours, minutes);
        
        // Get day/night status
        String period;
        if (hours >= 6 && hours < 12) {
            period = ChatColor.YELLOW + "☀ Sabah";
        } else if (hours >= 12 && hours < 18) {
            period = ChatColor.GOLD + "☀ Öğleden Sonra";
        } else if (hours >= 18 && hours < 21) {
            period = ChatColor.DARK_PURPLE + "🌙 Akşam";
        } else {
            period = ChatColor.DARK_BLUE + "🌙 Gece";
        }
        
        // Add lines to scoreboard (bottom to top)
        Score line9 = objective.getScore(ChatColor.GRAY + "━━━━━━━━━━━━━━━");
        line9.setScore(9);
        
        Score line8 = objective.getScore(" ");
        line8.setScore(8);
        
        Score line7 = objective.getScore(ChatColor.WHITE + "Saat:");
        line7.setScore(7);
        
        Score line6 = objective.getScore(ChatColor.AQUA + "" + ChatColor.BOLD + " " + timeString);
        line6.setScore(6);
        
        Score line5 = objective.getScore("  ");
        line5.setScore(5);
        
        Score line4 = objective.getScore(ChatColor.WHITE + "Zaman Dilimi:");
        line4.setScore(4);
        
        Score line3 = objective.getScore(" " + period);
        line3.setScore(3);
        
        Score line2 = objective.getScore("   ");
        line2.setScore(2);
        
        Score line1 = objective.getScore(ChatColor.GRAY + "━━━━━━━━━━━━━━━");
        line1.setScore(1);
        
        player.setScoreboard(scoreboard);
    }
    
    private void removeHUD(Player player) {
        player.setScoreboard(Bukkit.getScoreboardManager().getNewScoreboard());
    }
}
