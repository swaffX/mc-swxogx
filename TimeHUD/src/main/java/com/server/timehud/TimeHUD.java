package com.server.timehud;

import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitRunnable;
import org.bukkit.scoreboard.*;
import net.md_5.bungee.api.ChatMessageType;
import net.md_5.bungee.api.chat.TextComponent;

import java.util.HashMap;
import java.util.UUID;

public class TimeHUD extends JavaPlugin implements Listener {
    
    private HashMap<UUID, Boolean> hudEnabled = new HashMap<>();
    
    @Override
    public void onEnable() {
        getLogger().info("TimeHUD plugin enabled!");
        
        // Register events
        getServer().getPluginManager().registerEvents(this, this);
        
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
        }.runTaskTimer(this, 0L, 20L);
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
        
        // Custom join message in chat
        event.setJoinMessage(null);
        Bukkit.broadcastMessage("");
        Bukkit.broadcastMessage(ChatColor.GOLD + "  ★ " + ChatColor.GREEN + playerName + ChatColor.GRAY + " sunucuya katıldı!");
        Bukkit.broadcastMessage("");
        
        // Welcome title animation
        new BukkitRunnable() {
            int tick = 0;
            @Override
            public void run() {
                if (tick == 0) {
                    player.sendTitle(
                        ChatColor.GOLD + "★ " + ChatColor.WHITE + "Hoş Geldin" + ChatColor.GOLD + " ★",
                        ChatColor.AQUA + playerName,
                        10, 40, 10
                    );
                } else if (tick == 3) {
                    player.sendTitle(
                        "",
                        ChatColor.GRAY + "İyi oyunlar!",
                        0, 30, 20
                    );
                } else if (tick >= 5) {
                    cancel();
                }
                tick++;
            }
        }.runTaskTimer(this, 0L, 20L);
        
        // Welcome action bar
        new BukkitRunnable() {
            int count = 0;
            @Override
            public void run() {
                if (count < 5) {
                    player.spigot().sendMessage(ChatMessageType.ACTION_BAR, 
                        new TextComponent(ChatColor.YELLOW + "⚡ " + ChatColor.WHITE + "SWXOQX Sunucusuna Hoş Geldin! " + ChatColor.YELLOW + "⚡"));
                    count++;
                } else {
                    cancel();
                }
            }
        }.runTaskTimer(this, 60L, 20L);
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
            Criteria.DUMMY,
            ChatColor.GOLD + "" + ChatColor.BOLD + "⚡ SWXOQX ⚡"
        );
        objective.setDisplaySlot(DisplaySlot.SIDEBAR);
        objective.setRenderType(RenderType.INTEGER);
        
        // Get world time
        long worldTime = player.getWorld().getTime();
        int hours = (int) ((worldTime / 1000 + 6) % 24);
        int minutes = (int) ((worldTime % 1000) * 60 / 1000);
        String timeString = String.format("%02d:%02d", hours, minutes);
        
        // Calculate time until next period
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
        
        // Get period with icon
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
        
        // Online players
        int onlinePlayers = Bukkit.getOnlinePlayers().size();
        int maxPlayers = Bukkit.getMaxPlayers();
        
        // Build scoreboard without numbers on right side
        int score = 15;
        
        // Top border
        setScore(objective, ChatColor.DARK_GRAY + "▬▬▬▬▬▬▬▬▬▬▬▬▬▬", score--);
        
        // Player name
        setScore(objective, " ", score--);
        setScore(objective, ChatColor.WHITE + "Oyuncu: " + ChatColor.GREEN + player.getName(), score--);
        
        // Spacer
        setScore(objective, "  ", score--);
        
        // Time
        setScore(objective, ChatColor.WHITE + "Saat: " + ChatColor.AQUA + timeString, score--);
        setScore(objective, ChatColor.WHITE + "Dönem: " + period, score--);
        
        // Countdown
        setScore(objective, "   ", score--);
        setScore(objective, ChatColor.GRAY + "▸ " + nextPeriod + ": " + ChatColor.YELLOW + countdown, score--);
        
        // Spacer
        setScore(objective, "    ", score--);
        
        // Online players
        setScore(objective, ChatColor.WHITE + "Oyuncular: " + ChatColor.GREEN + onlinePlayers + ChatColor.GRAY + "/" + maxPlayers, score--);
        
        // Bottom border
        setScore(objective, "     ", score--);
        setScore(objective, ChatColor.DARK_GRAY + "▬▬▬▬▬▬▬▬▬▬▬▬▬▬", score--);
        
        player.setScoreboard(scoreboard);
    }
    
    private void setScore(Objective objective, String text, int score) {
        Score s = objective.getScore(text);
        s.setScore(score);
    }
    
    private void removeHUD(Player player) {
        player.setScoreboard(Bukkit.getScoreboardManager().getNewScoreboard());
    }
}
