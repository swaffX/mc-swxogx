package com.server.playerstats;

import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerQuitEvent;

public class PlayerListener implements Listener {
    
    private final PlayerStatsHUD plugin;
    
    public PlayerListener(PlayerStatsHUD plugin) {
        this.plugin = plugin;
    }
    
    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        // Oyuncu giriş zamanını kaydet
        plugin.setPlayerJoinTime(event.getPlayer());
        
        // HUD varsayılan olarak açıksa göster
        if (plugin.getConfig().getBoolean("hud.enabled-by-default", true)) {
            plugin.setHUDEnabled(event.getPlayer(), true);
        }
    }
    
    @EventHandler
    public void onPlayerQuit(PlayerQuitEvent event) {
        // HUD'u temizle
        plugin.getHUDManager().removeHUD(event.getPlayer());
    }
}
