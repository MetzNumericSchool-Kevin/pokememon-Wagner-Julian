import { config } from './config.js';
import { initDarkenEffect } from './animationTenebre.js';
import { initFeuilles } from './animationPlante.js';
import { lancerHallucination } from './animationPsy.js';
import { creerFlocons } from './animationGlace.js';
import { creerTremblement } from './animationSol.js';
import { creerCoup } from './animationCombat.js';
import { createLightning } from './animationElectrik.js';
import { startFireAnimation } from './animationFeu.js';
import { afficherBarreChromee } from './animationMetal.js';
import { creerEboulement } from './animationRoche.js';
import { createtinkle } from './animationFee.js';

const rejouer = document.getElementById('rejouer');
let compteurDeCoupDeLaPartieEnCours = document.getElementById("stat_nombre_de_coups_partie_en_cours");
let compteurDeCoupRecord = document.getElementById("stat_nombre_de_coups_record");
let pokedex = document.querySelector(".liste_pokemons_captures");

// Récupérer le record depuis le localStorage
let recordSauvegarde = localStorage.getItem("record");
compteurDeCoupRecord.textContent = recordSauvegarde ? recordSauvegarde : "∞";

async function jouer(unNombreDePaire) {
    function afficherLeBoutonRejouer() {
        const rejouer = document.getElementById('rejouer');
        rejouer.style.display = "block";
    }

    function masquerLeBoutonRejouer() {
        const rejouer = document.getElementById('rejouer');
        rejouer.style.display = "none";
    }

    compteurDeCoupDeLaPartieEnCours.textContent = 0;
    masquerLeBoutonRejouer();
    pokedex.innerHTML = ""; // Réinitialisation du Pokédex

    const monNombreDePaire = unNombreDePaire;
    let compteurPairesTrouvees = 0;

    // Récupération des Pokémon depuis le fichier JSON
    const response = await fetch('./data/pokemon.json');
    const maListeDePokemons = await response.json();
    
    
    const banqueDeSon = {
        bulbasaur: new Audio("./sound/Cri_0001_HOME.ogg"),
        charmander: new Audio("./sound/Cri_0004_HOME.ogg"),
        squirtle: new Audio("./sound/Cri_0007_HOME.ogg"),
        pikachu: new Audio("./sound/Cri_0025_HOME.ogg"),
        sandshrew: new Audio("./sound/Cri_0027_HOME.ogg"),
        sandslash: new Audio("./sound/Cri_0028_HOME.ogg"),
        meowth: new Audio("./sound/Cri_0052_HOME.ogg"),
        machamp: new Audio("./sound/Cri_0068_HOME.ogg"),
        tauros: new Audio("./sound/Cri_0128_HOME.ogg"),
        vaporeon: new Audio("./sound/Cri_0134_HOME.ogg"),
        jolteon: new Audio("./sound/Cri_0135_HOME.ogg"),
        flareon: new Audio("./sound/Cri_0136_HOME.ogg"),
        mewtwo: new Audio("./sound/Cri_0150_HOME.ogg"),
        mew: new Audio("./sound/Cri_0151_HOME.ogg"),
        sudowoodo: new Audio("./sound/Cri_0185_HOME.ogg"),
        espeon: new Audio("./sound/Cri_0196_HOME.ogg"),
        umbreon: new Audio("./sound/Cri_0197_HOME.ogg"),
        nosepass: new Audio("./sound/Cri_0299_HOME.ogg"),
        leafeon: new Audio("./sound/Cri_0470_HOME.ogg"),
        glaceon: new Audio("./sound/Cri_0471_HOME.ogg"),
        vanillite: new Audio("./sound/Cri_0582_HOME.ogg")
    };

    function jouerCriPokemon(unObjetSon, nomDuPokemon) {
        Object.values(unObjetSon).forEach(son => {
            son.preload = "auto";
        });
        if (unObjetSon[nomDuPokemon]) {
            unObjetSon[nomDuPokemon].play();
        }
    }
    

    function melangerUneListe(uneListe) {
        return uneListe.sort(() => Math.random() - 0.5);
    }

    function faireUneListeDePaireDePokemon(uneListeDePokemonComplete, unNombreDePaire) {
        let listeMelangee = melangerUneListe(uneListeDePokemonComplete);
        let listeReduite = listeMelangee.slice(0, unNombreDePaire);
        let listePaire = [...listeReduite, ...listeReduite];
        return melangerUneListe(listePaire);
    }

    function creerUnBoutonDeDeplacement(index) {
        let btn = document.createElement("button");
        btn.innerText = `Zone ${index + 1}`;
        btn.classList.add("btn-chasse");
        btn.setAttribute("data-target", `zoneDeCapture${index}`);
        document.getElementById("boutons_navigation").appendChild(btn);
    
        btn.addEventListener("click", function () {
            // Masquer toutes les zones
            document.querySelectorAll(".zoneDeCapture").forEach(zone => {
                zone.classList.add("visually-hidden"); // Utilisation de la classe 'visually-hidden' pour masquer
            });
    
            // Afficher la zone sélectionnée
            document.getElementById(`zoneDeCapture${index}`).classList.remove("visually-hidden");
        });
    }

    function surpriseDuDeplacement() {
        const boutonsDeDeplacement = document.querySelectorAll(".btn-chasse"); // Sélectionner tous les boutons avec la classe .btn-chasse
        console.log(boutonsDeDeplacement);
        
        if (boutonsDeDeplacement.length === 1) { // Vérifier s'il n'y a qu'un seul bouton
            boutonsDeDeplacement[0].style.display = "none"; // Masquer le seul bouton
        }
    }
    
    
    function creerLesEmplacementsDesCartes(unNombreDePaire) {
        let uneGrilleDeJeu = document.getElementById('grille_de_jeu');
        uneGrilleDeJeu.innerHTML = "";  // Vider la grille au démarrage
        document.getElementById("boutons_navigation").innerHTML = "";  // Vider les boutons au démarrage
    
        const unTotalDeCartes = unNombreDePaire * 2;
        const uneTailleDeZone = 16;
        const unNombreDeZones = Math.ceil(unTotalDeCartes / uneTailleDeZone);
    
        for (let i = 0; i < unNombreDeZones; i++) {
            let uneZoneDeChasse = document.createElement("div");
            uneZoneDeChasse.classList.add("row", "row-cols-4", "zoneDeCapture");
            uneZoneDeChasse.id = `zoneDeCapture${i}`;
            uneGrilleDeJeu.appendChild(uneZoneDeChasse);
            creerUnBoutonDeDeplacement(i);
            // Initialement, on masque toutes les zones sauf la première
            if (i > 0) {
                uneZoneDeChasse.classList.add("visually-hidden"); // Masquer les zones sauf la première
            }
    
            // Déterminer le nombre de cartes pour cette zone
            const unNombreDeCartesDansUneZone = 
                (i === unNombreDeZones - 1) ? unTotalDeCartes % uneTailleDeZone || uneTailleDeZone : uneTailleDeZone;
    
            for (let j = 0; j < unNombreDeCartesDansUneZone; j++) {
                const carte = document.createElement("div");
                carte.classList.add("col", "box");
                uneZoneDeChasse.appendChild(carte);
            }
        }
        surpriseDuDeplacement(); // Appel de la fonction pour masquer les boutons si nécessaire
    }
    

    function creerLeDosDesCartes() {
        document.querySelectorAll('.box').forEach((carte) => {
            const dosDeCarte = document.createElement("img");
            dosDeCarte.src = "./assets/bush.webp";
            dosDeCarte.classList.add("bush");
            carte.appendChild(dosDeCarte);
        });
    }

    function creerLaFaceDesCartes(uneListeDePokemon) {
        document.querySelectorAll('.box').forEach((carte, index) => {
            const pokemon = uneListeDePokemon[index];
            const faceDeCarte = document.createElement("img");
            faceDeCarte.src = pokemon.sprite;
            faceDeCarte.title = pokemon.name;
            faceDeCarte.role = pokemon.element;
            faceDeCarte.classList.add("pokemon", "d-none");
            carte.appendChild(faceDeCarte);
        });
    }

    function disparitionDUnCoteDUneCarte(element) {
        element.classList.add("d-none");
    }

    function apparitionDUnCoteDUneCarte(element) {
        element.classList.remove("d-none");
    }

    function capturerPaireDePokemons(cartes) {
        setTimeout(() => {
            cartes.forEach((carte) => {
                const pokeball = document.createElement("img");
                pokeball.src = "./assets/pokeball.png";
                pokeball.classList.add("pokeball");
                carte.appendChild(pokeball);
            });
        }, 2000);
    }

    function ajouterAuPokedex(image) {
        const pokemon = document.createElement("img");
        pokemon.src = image;
        pokedex.appendChild(pokemon);
    }

    function lancerPokeball(cartes) {
        cartes.forEach((carte, index) => {
            const pokeball = document.createElement("img");
            pokeball.className = `pokeball_de_capture pokeball_${index}`;
            pokeball.src = "./assets/pokeball.png";
            
            // Dimensions de l'écran
            const largeurEcran = window.innerWidth;
            const hauteurEcran = window.innerHeight;
    
            // Ajouter la Pokéball au DOM pour récupérer sa taille
            document.body.appendChild(pokeball);
            const pokeballSize = 300; // Taille définie dans le CSS
        
            // Position initiale centrée en bas
            pokeball.style.left = `${(largeurEcran / 2) - (pokeballSize / 2)}px`;
            pokeball.style.top = `${hauteurEcran}px`;
    
            // Récupérer la position du Pokémon
            const positionPokemon = carte.getBoundingClientRect();
    
            // Calcul du centre du Pokémon
            const cibleX = positionPokemon.left - (largeurEcran / 2) + (pokeballSize / 3);
            const cibleY = positionPokemon.top - (hauteurEcran + (pokeballSize / 4));
    
            // Appliquer la position cible en variables CSS
            pokeball.style.setProperty("--cible-x", `${cibleX}px`);
            pokeball.style.setProperty("--cible-y", `${cibleY}px`);
        
            // Supprimer la Pokéball après l'animation
            setTimeout(() => {
                pokeball.remove();
                capturerPaireDePokemons(cartes);
                const positionPokeball = pokeball.getBoundingClientRect();
                console.log(positionPokeball)
            }, 1000);
        });
    }    

    let mesPointsDeVieDeDepart = 100;
    let vieRestante = mesPointsDeVieDeDepart;
    
    function prendreDesCoups() {
        let uneBarreDeVie = document.querySelector(".progress-bar");
        vieRestante = Math.max(0, vieRestante - 10);
        uneBarreDeVie.style.setProperty("--resteDelaBarreDeVie", vieRestante + "%");
        document.querySelector(".progress").setAttribute("aria-valuenow", vieRestante);
        if (vieRestante === 0) {
            setTimeout(() => alert("Vous avez perdu !"), 500);
        }
    }

    function remplirBarreDeVie() {
        mesPointsDeVieDeDepart = 100;
        let uneBarreDeVie = document.querySelector(".progress-bar");
        uneBarreDeVie.style.setProperty("--resteDelaBarreDeVie", mesPointsDeVieDeDepart + "%");
    }

    function retournerUneCarte() {
        let cartes = document.querySelectorAll('.box');
        let cartesRetournees = [];

        cartes.forEach((carte) => {
            carte.addEventListener('click', () => {
                let bush = carte.querySelector('.bush');
                let pokemon = carte.querySelector('.pokemon');
                if (!bush || !pokemon || cartesRetournees.includes(carte)) return;

                // condition d'effet

                disparitionDUnCoteDUneCarte(bush);
                apparitionDUnCoteDUneCarte(pokemon);
                cartesRetournees.push(carte);

                if (cartesRetournees.length === 2) {
                    document.body.style.pointerEvents = "none";
                    compteurDeCoupDeLaPartieEnCours.textContent = parseInt(compteurDeCoupDeLaPartieEnCours.textContent) + 1;
                    let [carte1, carte2] = cartesRetournees;
                    let img1 = carte1.querySelector('.pokemon');
                    let img2 = carte2.querySelector('.pokemon');
                    let positionImage1 = img1.getBoundingClientRect()
                    console.log(positionImage1);

                    if (img1.src === img2.src) {
                        if (img1.role == "ice") {
                            creerFlocons();                           
                        } else if (img1.role == "ground") {
                            creerTremblement();
                        } else if (img1.role == "fighting") {
                            creerCoup()
                        } else if (img1.role == "rock") {
                            creerEboulement();
                        } else if (img1.role == "psychic") {
                            lancerHallucination({
                                duration: '4s'
                              });
                        } else if (img1.role == "dark") {
                            initDarkenEffect({
                                darknessIncrement: 0.01, // chaque pas = 0.01 opacité
                                animationIntervalDelay: 40, // 40ms par pas
                                resetDelayAfterDark: 0 // facultatif, ou mets genre 500 pour laisser le noir un peu avant de disparaître
                              });
                        } else if (img1.role == "grass") {
                            initFeuilles();
                        } else if (img1.role== "electric") {
                            createLightning();
                        } else if (img1.role == "fire") {
                            startFireAnimation('fireCanvas', config);
                        } else if (img1.role == "steel") {
                            afficherBarreChromee();
                        } else if (img1.role == "fairy") {
                            createtinkle();
                        }
                              
                        
                              
                          
                        lancerPokeball(cartesRetournees);
                        ajouterAuPokedex(img1.src);
                        jouerCriPokemon(banqueDeSon, img1.title);
                        cartesRetournees = [];
                        compteurPairesTrouvees++;

                        if (compteurPairesTrouvees === monNombreDePaire) {
                            setTimeout(() => {
                                let coupsActuels = parseInt(compteurDeCoupDeLaPartieEnCours.textContent);
                                let recordActuel = parseInt(compteurDeCoupRecord.textContent);

                                if (isNaN(recordActuel) || coupsActuels < recordActuel) {
                                    compteurDeCoupRecord.textContent = coupsActuels;
                                    localStorage.setItem("record", coupsActuels);
                                }

                                alert("Bravo ! Vous avez gagné !");
                                afficherLeBoutonRejouer();
                            }, 1000);
                        }
                        document.body.style.pointerEvents = "auto";
                    } else {
                        setTimeout(() => {
                            prendreDesCoups()
                            apparitionDUnCoteDUneCarte(carte1.querySelector('.bush'));
                            disparitionDUnCoteDUneCarte(carte1.querySelector('.pokemon'));
                            apparitionDUnCoteDUneCarte(carte2.querySelector('.bush'));
                            disparitionDUnCoteDUneCarte(carte2.querySelector('.pokemon'));
                            cartesRetournees = [];
                            document.body.style.pointerEvents = "auto";
                        }, 1000);
                    }
                }
            });
        });
    }

    remplirBarreDeVie();
    const maListeDePaireDePokemons = faireUneListeDePaireDePokemon(maListeDePokemons, monNombreDePaire);
    creerLesEmplacementsDesCartes(monNombreDePaire);
    creerLeDosDesCartes();
    creerLaFaceDesCartes(maListeDePaireDePokemons);
    retournerUneCarte();
}

// Démarrer le jeu
let monNombreDePaire = 6;

jouer(monNombreDePaire);

rejouer.addEventListener('click', () => {
    if (monNombreDePaire < 20) {
        monNombreDePaire += 2;
    }
    jouer(monNombreDePaire);
});
