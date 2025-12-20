package com.server.playerstats;

import org.bukkit.Bukkit;
import org.bukkit.entity.Player;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitRunnable;

import java.util.HashMap;
import java.util.UUID;

public class PlayerStatsHUD extends JavaPlugin {
    
    private HashMap<UUID, Boolean> hudEnabled = new HashMap<>();
    private HashMap<UUID, Long> playerJoinTime = new HashMap<>();
    private HUDManager hudManager;
    
    @Override
    public void onEnable() {
        // Config kaydet
        saveDefaultConfig();
        
        // HUD Manager başlat
        hudManager = new HUDManager(this);
        
        // Komut kaydet
        getCommand("playerhud").setExecutor(new PlayerHUDCommand(this));
        
        // Event listener kaydet
        getServer().getPluginManager().registerEvents(new PlayerListener(this), this);
        
        // HUD güncelleme task'ı başlat
        int updateInterval = getConfig().getInt("hud.update-interval", 20);
        new BukkitRunnable() {
            @Override
            public void run() {
                for (Player player : Bukkit.getOnlinePlayers()) {
                    if (isHUDEnabled(player)) {
                        hudManager.updateHUD(player);
                    }
                }
            }
        }.runTaskTimer(this, 0L, updateInterval);
        
        getLogger().info("PlayerStatsHUD plugin enabled!");
    }
    
    @Override
    public void onDisable() {
        // Tüm HUD'ları temizle
        for (Player player : Bukkit.getOnlinePlayers()) {
            hudManager.removeHUD(player);
        }
        
        getLogger().info("PlayerStatsHUD plugin disabled!");
    }
    
    public boolean isHUDEnabled(Player player) {
        return hudEnabled.getOrDefault(player.getUniqueId(), 
            getConfig().getBoolean("hud.enabled-by-default", true));
    }
    
    public void setHUDEnabled(Player player, boolean enabled) {
        hudEnabled.put(player.getUniqueId(), enabled);
        if (!enabled) {
            hudManager.removeHUD(player);
        }
    }
    
    public void setPlayerJoinTime(Player player) {
        playerJoinTime.put(player.getUniqueId(), System.currentTimeMillis());
    }
    
    public long getPlaytime(Player player) {
        Long joinTime = playerJoinTime.get(player.getUniqueId());
        if (joinTime == null) {
            return 0;
        }
        return System.currentTimeMillis() - joinTime;
    }
    
    public HUDManager getHUDManager() {
        return hudManager;
    }
}
