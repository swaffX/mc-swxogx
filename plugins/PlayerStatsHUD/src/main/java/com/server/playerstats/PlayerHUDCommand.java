package com.server.playerstats;

import org.bukkit.ChatColor;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

public class PlayerHUDCommand implements CommandExecutor {
    
    private final PlayerStatsHUD plugin;
    
    public PlayerHUDCommand(PlayerStatsHUD plugin) {
        this.plugin = plugin;
    }
    
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!(sender instanceof Player)) {
            sender.sendMessage(ChatColor.RED + "Bu komut sadece oyuncular tarafından kullanılabilir!");
            return true;
        }
        
        Player player = (Player) sender;
        
        if (!player.hasPermission("playerstats.use")) {
            String noPermMsg = ChatColor.translateAlternateColorCodes('&',
                plugin.getConfig().getString("messages.no-permission", 
                "&cBu komutu kullanma izniniz yok!"));
            player.sendMessage(noPermMsg);
            return true;
        }
        
        if (args.length == 0) {
            // Toggle HUD
            boolean currentState = plugin.isHUDEnabled(player);
            plugin.setHUDEnabled(player, !currentState);
            
            String message;
            if (!currentState) {
                message = ChatColor.translateAlternateColorCodes('&',
                    plugin.getConfig().getString("messages.enabled", 
                    "&aPlayerStats HUD açıldı!"));
            } else {
                message = ChatColor.translateAlternateColorCodes('&',
                    plugin.getConfig().getString("messages.disabled", 
                    "&cPlayerStats HUD kapatıldı!"));
            }
            player.sendMessage(message);
            return true;
        }
        
        String subCommand = args[0].toLowerCase();
        
        switch (subCommand) {
            case "aç":
            case "ac":
            case "on":
            case "enable":
                plugin.setHUDEnabled(player, true);
                String enableMsg = ChatColor.translateAlternateColorCodes('&',
                    plugin.getConfig().getString("messages.enabled", 
                    "&aPlayerStats HUD açıldı!"));
                player.sendMessage(enableMsg);
                break;
                
            case "kapat":
            case "off":
            case "disable":
                plugin.setHUDEnabled(player, false);
                String disableMsg = ChatColor.translateAlternateColorCodes('&',
                    plugin.getConfig().getString("messages.disabled", 
                    "&cPlayerStats HUD kapatıldı!"));
                player.sendMessage(disableMsg);
                break;
                
            case "reload":
                if (!player.hasPermission("playerstats.admin")) {
                    String noPermMsg = ChatColor.translateAlternateColorCodes('&',
                        plugin.getConfig().getString("messages.no-permission", 
                        "&cBu komutu kullanma izniniz yok!"));
                    player.sendMessage(noPermMsg);
                    return true;
                }
                plugin.reloadConfig();
                String reloadMsg = ChatColor.translateAlternateColorCodes('&',
                    plugin.getConfig().getString("messages.reload", 
                    "&eConfig yeniden yüklendi!"));
                player.sendMessage(reloadMsg);
                break;
                
            default:
                player.sendMessage(ChatColor.YELLOW + "Kullanım: /playerhud [aç|kapat|reload]");
                break;
        }
        
        return true;
    }
}
