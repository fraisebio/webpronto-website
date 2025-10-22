#!/usr/bin/env python3
"""
Serveur simple pour WebPronto
Lance le site sur http://localhost:5050
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

# Configuration
PORT = 5050
HOST = 'localhost'

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Handler personnalisé pour servir les fichiers statiques"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(os.path.abspath(__file__)), **kwargs)
    
    def end_headers(self):
        # Ajouter des headers pour éviter les problèmes de CORS
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_GET(self):
        # Rediriger toutes les routes vers index.html pour le SPA
        if self.path == '/' or self.path == '/index.html':
            self.path = '/index.html'
        elif self.path in ['/services', '/portfolio', '/contact']:
            self.path = '/index.html'
        
        return super().do_GET()

def main():
    """Fonction principale pour démarrer le serveur"""
    
    # Vérifier que nous sommes dans le bon répertoire
    if not os.path.exists('index.html'):
        print("❌ Erreur: index.html non trouvé dans le répertoire courant")
        print("📁 Assurez-vous d'être dans le répertoire du projet WebPronto")
        sys.exit(1)
    
    try:
        # Créer le serveur
        with socketserver.TCPServer((HOST, PORT), CustomHTTPRequestHandler) as httpd:
            print("🚀 Serveur WebPronto démarré !")
            print(f"📱 Site accessible sur: http://{HOST}:{PORT}")
            print("⚡ Développement en cours...")
            print("\n💡 Appuyez sur Ctrl+C pour arrêter le serveur")
            print("=" * 50)
            
            # Ouvrir automatiquement le navigateur
            try:
                webbrowser.open(f'http://{HOST}:{PORT}')
                print("🌐 Ouverture automatique du navigateur...")
            except:
                print("⚠️  Impossible d'ouvrir automatiquement le navigateur")
                print(f"🔗 Ouvrez manuellement: http://{HOST}:{PORT}")
            
            # Démarrer le serveur
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Erreur: Le port {PORT} est déjà utilisé")
            print("💡 Essayez de fermer l'autre application ou changez le port")
        else:
            print(f"❌ Erreur lors du démarrage du serveur: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n👋 Arrêt du serveur WebPronto...")
        print("✅ Serveur arrêté avec succès")
        sys.exit(0)

if __name__ == "__main__":
    main()
