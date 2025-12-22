package com.server.timehud;

import org.bukkit.ChatColor;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.command.TabCompleter;
import org.bukkit.entity.Player;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class TimeHUDCommand implements CommandExecutor, TabCompleter {
    
    private final TimeHUD plugin;
    
    public TimeHUDCommand(TimeHUD plugin) {
        this.plugin = plugin;
    }
    
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (args.length == 0) {
            // Toggle HUD
            if (!(sender instanceof Player)) {
                sender.sendMessage(ChatColor.RED + "Bu komut sadece oyuncular tarafından kullanılabilir!");
                return true;
            }
            
            Player player = (Player) sender;
            boolean enabled = !plugin.isHUDEnabled(player);
            plugin.setHUDEnabled(player, enabled);
            
            if (enabled) {
                player.sendMessage(ChatColor.GREEN + "✓ TimeHUD açıldı!");
            } else {
                player.sendMessage(ChatColor.RED + "✗ TimeHUD kapatıldı!");
            }
            return true;
        }
        
        String subCommand = args[0].toLowerCase();
        
        switch (subCommand) {
            case "on":
                if (!(sender instanceof Player)) {
                    sender.sendMessage(ChatColor.RED + "Bu komut sadece oyuncular tarafından kullanılabilir!");
                    return true;
                }
                plugin.setHUDEnabled((Player) sender, true);
                sender.sendMessage(ChatColor.GREEN + "✓ TimeHUD açıldı!");
                break;
                
            case "off":
                if (!(sender instanceof Player)) {
                    sender.sendMessage(ChatColor.RED + "Bu komut sadece oyuncular tarafından kullanılabilir!");
                    return true;
                }
                plugin.setHUDEnabled((Player) sender, false);
                sender.sendMessage(ChatColor.RED + "✗ TimeHUD kapatıldı!");
                break;
                
            case "reload":
                if (!sender.hasPermission("timehud.reload")) {
                    sender.sendMessage(ChatColor.RED + "Bu komutu kullanma yetkiniz yok!");
                    return true;
                }
                plugin.reloadConfig();
                plugin.loadConfiguration();
                sender.sendMessage(ChatColor.GREEN + "✓ TimeHUD yapılandırması yeniden yüklendi!");
                break;
                
            case "help":
                sendHelp(sender);
                break;
                
            default:
                sender.sendMessage(ChatColor.RED + "Bilinmeyen komut! /timehud help yazın.");
        }
        
        return true;
    }
    
    private void sendHelp(CommandSender sender) {
        sender.sendMessage(ChatColor.GOLD + "═══════ TimeHUD Yardım ═══════");
        sender.sendMessage(ChatColor.YELLOW + "/timehud " + ChatColor.GRAY + "- HUD'u aç/kapat");
        sender.sendMessage(ChatColor.YELLOW + "/timehud on " + ChatColor.GRAY + "- HUD'u aç");
        sender.sendMessage(ChatColor.YELLOW + "/timehud off " + ChatColor.GRAY + "- HUD'u kapat");
        if (sender.hasPermission("timehud.reload")) {
            sender.sendMessage(ChatColor.YELLOW + "/timehud reload " + ChatColor.GRAY + "- Yapılandırmayı yeniden yükle");
        }
        sender.sendMessage(ChatColor.GOLD + "══════════════════════════");
    }
    
    @Override
    public List<String> onTabComplete(CommandSender sender, Command command, String alias, String[] args) {
        List<String> completions = new ArrayList<>();
        
        if (args.length == 1) {
            List<String> subCommands = new ArrayList<>(Arrays.asList("on", "off", "help"));
            if (sender.hasPermission("timehud.reload")) {
                subCommands.add("reload");
            }
            
            for (String sub : subCommands) {
                if (sub.startsWith(args[0].toLowerCase())) {
                    completions.add(sub);
                }
            }
        }
        
        return completions;
    }
}
