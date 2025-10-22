const express = require('express');
const path = require('path');

const app = express();
const PORT = 5050;

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname)));

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route pour les autres pages (si nécessaire)
app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/portfolio', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur WebPronto démarré sur http://localhost:${PORT}`);
    console.log(`📱 Site accessible sur votre navigateur`);
    console.log(`⚡ Développement en cours...`);
    console.log(`\n💡 Appuyez sur Ctrl+C pour arrêter le serveur`);
});

// Gestion gracieuse de l'arrêt
process.on('SIGINT', () => {
    console.log('\n👋 Arrêt du serveur WebPronto...');
    process.exit(0);
});
