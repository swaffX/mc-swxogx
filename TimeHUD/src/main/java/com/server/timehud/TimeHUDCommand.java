package com.server.timehud;

import org.bukkit.ChatColor;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

public class TimeHUDCommand implements CommandExecutor {
    
    private final TimeHUD plugin;
    
    public TimeHUDCommand(TimeHUD plugin) {
        this.plugin = plugin;
    }
    
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!(sender instanceof Player)) {
            sender.sendMessage(ChatColor.RED + "Bu komut sadece oyuncular tarafından kullanılabilir!");
            return true;
        }
        
        Player player = (Player) sender;
        
        if (args.length == 0) {
            // Toggle HUD
            boolean currentState = plugin.isHUDEnabled(player);
            plugin.setHUDEnabled(player, !currentState);
            
            if (!currentState) {
                player.sendMessage(ChatColor.GREEN + "Zaman HUD'u açıldı!");
            } else {
                player.sendMessage(ChatColor.RED + "Zaman HUD'u kapatıldı!");
            }
            return true;
        }
        
        if (args[0].equalsIgnoreCase("on") || args[0].equalsIgnoreCase("aç")) {
            plugin.setHUDEnabled(player, true);
            player.sendMessage(ChatColor.GREEN + "Zaman HUD'u açıldı!");
            return true;
        }
        
        if (args[0].equalsIgnoreCase("off") || args[0].equalsIgnoreCase("kapat")) {
            plugin.setHUDEnabled(player, false);
            player.sendMessage(ChatColor.RED + "Zaman HUD'u kapatıldı!");
            return true;
        }
        
        player.sendMessage(ChatColor.RED + "Kullanım: /timehud [aç|kapat]");
        return true;
    }
}
