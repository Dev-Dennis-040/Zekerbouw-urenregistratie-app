document.addEventListener('DOMContentLoaded', () => {
    // Datum en tijd bijwerken zodra de pagina is geladen en vervolgens elke seconde
    updateDateTime();
    setInterval(updateDateTime, 1000);

    const openWerkzaamhedenButton = document.getElementById('open-werkzaamheden-button');
    const hoofdstukModal = document.getElementById('hoofdstuk-modal');
    const werkzaamhedenModal = document.getElementById('werkzaamheden-modal');
    const hoofdstukVolgendeButton = document.getElementById('hoofdstuk-volgende');
    const werkzaamhedenOpslaanButton = document.getElementById('werkzaamheden-opslag');
    const hoofdstukRadios = document.getElementsByName('hoofdstuk');
    const textarea = document.getElementById('werkzaamheden');
    const werkzaamhedenSamenvatting = document.getElementById('werkzaamheden-samenvatting');
    const geselecteerdHoofdstukElement = document.getElementById('geselecteerd-hoofdstuk');
    const werkzaamhedenOmschrijvingElement = document.getElementById('werkzaamheden-omschrijving');
   
    // Verberg de modals bij het laden van de pagina
    if (hoofdstukModal) hoofdstukModal.style.display = 'none';
    if (werkzaamhedenModal) werkzaamhedenModal.style.display = 'none';

    if (openWerkzaamhedenButton) {
        openWerkzaamhedenButton.addEventListener('click', () => {// Event listener voor de knop "Werkzaamheden invullen"
            console.log('Werkzaamheden knop is geklikt');
            hoofdstukModal.style.display = 'block'; // Toont de modal pas wanneer er op de knop wordt geklikt
        });
    }
    // Event listener voor het selecteren van een hoofdstuk
    hoofdstukRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            // Zorg ervoor dat het geselecteerde hoofdstuk wordt opgeslagen
            const geselecteerdHoofdstuk = radio.value;
            textarea.dataset.selectedHoofdstuk = geselecteerdHoofdstuk;
            console.log(`Geselecteerd hoofdstuk: ${geselecteerdHoofdstuk}`);

            // Verberg de hoofdstukken modal en toon de werkzaamheden modal
            hoofdstukModal.style.display = 'none';
            werkzaamhedenModal.style.display = 'block';

            // Focus direct op het textarea voor een betere gebruikerservaring
            textarea.focus();
        });
    });

    // Event listener voor de knop "Opslaan" in het werkzaamheden modal
    if (werkzaamhedenOpslaanButton) {
        werkzaamhedenOpslaanButton.addEventListener('click', () => {
            const werkzaamheden = textarea.value;
            const geselecteerdHoofdstuk = textarea.dataset.selectedHoofdstuk;

            if (werkzaamheden.trim() === '') {
                alert("Vul de werkzaamheden in om verder te gaan.");
            } else {
                werkzaamhedenModal.style.display = 'none';
                werkzaamhedenSamenvatting.style.display = 'block';
                geselecteerdHoofdstukElement.innerText = `${geselecteerdHoofdstuk}`;
                werkzaamhedenOmschrijvingElement.innerText = `${werkzaamheden}`;
            }
        });
    }

    // Sluiten van de modal bij klikken buiten de inhoud
    window.addEventListener('click', (event) => {
        if (event.target === hoofdstukModal) {
            hoofdstukModal.style.display = 'none';
        }
        if (event.target === werkzaamhedenModal) {
            werkzaamhedenModal.style.display = 'none';
        }
    });
});


    // Koppel de downloadPDF functie aan een button
    const downloadButton = document.getElementById('download-pdf-button');
    if (downloadButton) {
        downloadButton.addEventListener('click', downloadPDF);
    }
    
function berekenUren() {
    // Verkrijg de waarden van de invoervelden
    const starttijd = document.getElementById('starttijd').value;
    const eindtijd = document.getElementById('eindtijd').value;
    const pauze = parseInt(document.getElementById('pauze').value) || 0; // Pauze in minuten, standaard 0 als leeg

    // Controleer of de starttijd en eindtijd zijn ingevuld
    if (!starttijd || !eindtijd) {
        document.getElementById('output').innerText = "Vul zowel starttijd als eindtijd in.";
        return;
    }
    // Omzetten van tijd naar minuten
    const start = new Date(`1970-01-01T${starttijd}:00`);
    const eind = new Date(`1970-01-01T${eindtijd}:00`);
    // Bereken het verschil in minuten
    let verschil = (eind - start) / (1000 * 60) - pauze;
    // Controleer op negatieve resultaten
    if (verschil < 0) {
        document.getElementById('output').innerText = "Controleer start- en eindtijd.";
        return;
    }
    // Converteer minuten naar uren en afronden op twee decimalen
    const gewerkteUren = (verschil / 60).toFixed(2);
    // Toon het resultaat
    document.getElementById('output').innerText = `Totaal gewerkte uren: ${gewerkteUren} uur`;
}

function deelGegevens() {
    // Verkrijg de ingevulde gegevens
    const medewerker = document.getElementById('medewerker').value;
    const datum = document.getElementById('datum').value;
    const project = document.getElementById('project').value;
    const werkzaamhedenTextArea = document.getElementById('werkzaamheden');
    const werkzaamheden = werkzaamhedenTextArea.value;
    const selectedHoofdstuk = werkzaamhedenTextArea.dataset.selectedHoofdstuk || 'Geen hoofdstuk geselecteerd';
    const starttijd = document.getElementById('starttijd').value;
    const eindtijd = document.getElementById('eindtijd').value;
    const pauze = document.getElementById('pauze').value;
    const gewerkteUren = document.getElementById('output').innerText.replace('Totaal gewerkte uren: ', '').replace(' uur', '');

    // Stel de te delen tekst samen
    const deelText = `
Zekerbouw Uren Calculator
Naam Medewerker: ${medewerker}
Datum: ${datum}
Project: ${project}
STABU-code: ${selectedHoofdstuk}
Werkzaamheden: ${werkzaamheden}
Starttijd: ${starttijd}
Eindtijd: ${eindtijd}
Pauze: ${pauze} minuten
Totaal gewerkte uren: ${gewerkteUren} uur
`;

    // Controleer of de share-functie wordt ondersteund door de browser
    if (navigator.share) {
        navigator.share({
            title: 'Zekerbouw Uren Calculator',
            text: deelText,
        })
        .then(() => {
            console.log('Gegevens succesvol gedeeld');
        })
        .catch((error) => {
            console.error('Fout bij het delen van de gegevens:', error);
        });
    } else {
        alert('Delen wordt niet ondersteund op dit apparaat.');
    }
}

// Functie om een PDF te downloaden met de ingevulde gegevens
function downloadPDF() {
    const { jsPDF } = window.jspdf;

    // Verkrijg de ingevulde gegevens
    const medewerker = document.getElementById('medewerker').value;
    const datum = document.getElementById('datum').value;
    const project = document.getElementById('project').value;
    const werkzaamhedenTextArea = document.getElementById('werkzaamheden');
    const werkzaamheden = werkzaamhedenTextArea.value;
    const selectedHoofdstuk = werkzaamhedenTextArea.dataset.selectedHoofdstuk || 'Geen hoofdstuk geselecteerd';
    const starttijd = document.getElementById('starttijd').value;
    const eindtijd = document.getElementById('eindtijd').value;
    const pauze = document.getElementById('pauze').value;
    const gewerkteUren = document.getElementById('output').innerText.replace('Totaal gewerkte uren: ', '').replace(' uur', '');

    // Laad het logo vanuit je lokale bestand
    const logoImage = "zekerbouw-logo-nieuw.jpg"; // Zorg dat dit bestand in dezelfde map staat als je script

    // Maak een nieuw PDF document
    const doc = new jsPDF();

    // Voeg het logo toe
    doc.addImage(logoImage, "JPEG", 15, 10, 90, 30); // Plaats en grootte: pas aan naar wens

    // Voeg bedrijfsinformatie en titel toe
    doc.setFontSize(16);
    doc.text("Zekerbouw B.V. Uren Calculator", 120, 20); // Titel naast het logo
    doc.setFontSize(10);
    doc.text("Adres: Spegelt 5 5674 CE Nuenen", 120, 30);
    doc.text("Telefoon: 040-2025085", 120, 35);
    doc.text("Email: info@zeker-bouw.nl", 120, 40);

    // Voeg inhoud toe aan de PDF
    doc.setFontSize(16);
    doc.text("Zekerbouw Uren Calculator", 20, 50);
    doc.setFontSize(12);
    doc.text(`Naam Medewerker: ${medewerker}`, 20, 60);
    doc.text(`Datum: ${datum}`, 20, 70);
    doc.text(`Project: ${project}`, 20, 80);
    doc.text(`STABU-code: ${selectedHoofdstuk}`, 20, 90);
    doc.text(`Werkzaamheden: ${werkzaamheden}`, 20, 100);
    doc.text(`Starttijd: ${starttijd}`, 20, 110);
    doc.text(`Eindtijd: ${eindtijd}`, 20, 120);
    doc.text(`Pauze: ${pauze} minuten`, 20, 130);
    doc.text(`Totaal gewerkte uren: ${gewerkteUren} uur`, 20, 140);

    // Voeg een footer toe
    doc.setFontSize(8);
    doc.text("Gegenereerd door Zekerbouw UrenCalculator", 20, 165);
    doc.text("© 2024 Dev Dennis. Alle rechten voorbehouden.", 20, 175);

    // Stel de bestandsnaam samen
    const fileName = `Zekerbouw - Uren Calculator - ${medewerker} - ${datum}.pdf`;

    // Sla de PDF op en start de download
    doc.save(fileName);
}

// Functie om datum en tijd bij te werken
function updateDateTime() {
    const now = new Date();

    // Haal de datum en tijd op
    const datum = now.toLocaleDateString('nl-NL', {
        weekday: 'long', // Volledige dagnaam
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const tijd = now.toLocaleTimeString('nl-NL', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // Bereken het weeknummer
    const start = new Date(now.getFullYear(), 0, 1);
    const weeknummer = Math.ceil((((now - start) / 86400000) + start.getDay() + 1) / 7);

    // Werk de HTML elementen bij
    document.getElementById('weeknummer').innerText = `Weeknummer: ${weeknummer}`;
    document.getElementById('datum-en-tijd').innerText = `${datum} | Tijd: ${tijd}`;
}
