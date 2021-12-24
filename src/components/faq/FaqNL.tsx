import React from "react";

import { StyledContentSegment } from "./styles";

export const FaqNL = ({ setDemoVisibility }: any) => (
  <>
    <StyledContentSegment>
      <h1>Wat is de MapitOut tool?</h1>
      <p>
        De MapitOut tool is een interactieve kaart die helpt mogelijke
        woonlocaties te vinden door de gewenste max. reistijd naar verschillende
        locaties in te voeren. NB: de tool is niet bedoeld voor het real-time
        plannen van een reis, daarvoor kunt u gebruik maken van real-time
        platforms zoals{" "}
        <a href="https://9292.nl/" target="_blank" rel="noopener noreferrer">
          www.9292.nl/
        </a>{" "}
        (openbaar vervoer) en{" "}
        <a
          href="https://maps.google.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Maps
        </a>
        .
      </p>
      <p>
        Internationals die in regio Amsterdam komen werken en de regio nog niet
        kennen kunnen meer informatie over de verschillende deelgebieden van
        metropoolregio Amsterdam vinden op het{" "}
        <a
          href="https://www.iamsterdam.com/en/living/about-living-in-amsterdam/living-in-the-amsterdam-area"
          target="_blank"
          rel="noopener noreferrer"
        >
          ‘Living in the Amsterdam Area’
        </a>
        .
      </p>
    </StyledContentSegment>
    <StyledContentSegment>
      <h1>Voor wie is de tool?</h1>
      <p>
        Iedereen die meer wil weten over reistijden in Nederland kan de MapitOut
        tool gebruiken! Gebruikers kunnen voor zowel de Nederlands- als
        Engelstalige versie kiezen, daarnaast gebruikt de tool veel symbolen en
        visuele elementen.
      </p>
    </StyledContentSegment>
    <StyledContentSegment>
      <h1>Hoe werkt de tool?</h1>
      <p>
        Stel je wilt max. een half uur reizen naar werk met het openbaar
        vervoer, terwijl je niet verder dan 15 minuten met de fiets van de
        school van je kinderen wilt wonen. MapitOut toont de gebieden voor beide
        zoekvragen en het overlappende gebied. Dit overlappende gebied toont de
        potentiële woonlocaties die aan beide criteria voldoen. Je kunt doorgaan
        locaties toe te voegen, zoals de werklocatie van je partner of het huis
        van een vriend.{" "}
        <span className="link" onClick={() => setDemoVisibility(true)}>
          Bekijk het instructiefilmpje om de tool in actie te zien
        </span>
        .
      </p>
    </StyledContentSegment>
    <StyledContentSegment>
      <h1>Hoe krijg ik toegang tot de tool?</h1>
      <p>
        De MapitOut tool is te vinden op bovengenoemde ‘Living in the Amsterdam
        Area’ pagina of direct via{" "}
        <a
          href="https://mapitout.iamsterdam.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://mapitout.iamsterdam.com
        </a>
        .
      </p>
    </StyledContentSegment>
    <StyledContentSegment>
      <h1>Wat kan ik doen als de tool niet werkt? </h1>
      <p>
        Oh nee! Probeer als eerste de url te vernieuwen of een andere browser te
        gebruiken (bijv. Firefox of Chrome). Als er nog steeds problemen zijn
        dan horen wij dat graag via mailadres{" "}
        <a
          href="mailto:welcome@amsterdam.nl"
          target="_blank"
          rel="noopener noreferrer"
        >
          welcome@amsterdam.nl
        </a>
        , met vermelding opmerking/vraag MapitOut tool (bij voorkeur met
        printscreen en vermelding van de browser).
      </p>
    </StyledContentSegment>
    <StyledContentSegment>
      <h1>Wat voor reisinformatie wordt gebruikt?</h1>
      <p>
        De reistijden worden op basis van verschillende databronnen berekend.
        Google Maps word gebruikt voor het basiniveau waarin wegen, straten
        en stations worden aangegeven. Daar bovenop komt een laag met openbaar
        vervoer (OV) dat gebruikt maakt van verschillende reisschema’s incl. van
        agentschappen zoals NS, GVB, Flixbus, R-net en meer. De reistijd modellen
        voor rijden, fietsen en lopen zijn ontwikkeld door het Traveltime Plaform, gebaseerd op OpenStreetMaps.{" "}
        <a
          href="https://www.traveltimeplatform.com/turn-radius-maps-into-travel-time"
          target="_blank"
          rel="noopener noreferrer"
        >
          Zie Traveltime voor meer informatie.
        </a>
      </p>
    </StyledContentSegment>
    <StyledContentSegment>
      <h1>
        Hoe wordt het bereik met de fiets of het openbaar vervoer bepaald?
      </h1>
      <p>
        De tool gaat ervan uit dat de gebruiker bij de start van de reis gebruik
        kan maken van een fiets, en dat men max. 10 minuten fietst tot het OV.
        Voor het parkeren van de fiets wordt 5 minuten gerekend. Ook wordt ervan
        uitgegaan dat gebruikers, als dat sneller gaat, bereid zijn naar een
        beginpunt of tussen twee OV verbindingen te lopen.
      </p>
      <p>
        Als de reiziger eenmaal een vorm van OV pakt zoals de trein, gaat de
        tool ervan uit dat de reiziger voor de rest van de tijd met het OV
        reist. De enige uitzondering hierop is de veerpont daar bewoners vaak de
        fiets daarop meenemen. Voorbeelden van een reis binnen 30 minuten:
      </p>
      <ul>
        <li>
          Fiets 8 minuten + parkeer 5 minuten + loop 5 minuten + metro 12
          minuten (30 minuten)
        </li>
        <li>
          Fiets 10 minuten, parkeer 5 minuten + trein 15 minuten (30 minuten)
        </li>
        <li>Loop 12 minuten (12 minuten – bereikbaar binnen 30 minuten)</li>
      </ul>
    </StyledContentSegment>
    <StyledContentSegment>
      <h1>Ik wil deze tool ook aanbieden, kan dat?</h1>
      <p>
        Dat is geweldig, misschien kunnen wij daarbij helpen. Je kunt altijd
        verwijzen naar de MapitOut tool. Maar misschien wil je de
        functionaliteit van de tool (bereik binnen bepaalde reistijd met bepaald
        vervoersmiddel) toepassen op je eigen website. De applicatie is open
        source ontwikkeld, wat betekent dat je een afgeleide kunt ontwikkelen.
        Om de tool te laten werken als de MapitOut tool dien je daarbij een
        eigen data contract af te sluiten (zoals met TravelTime), nadere
        informatie vindt je op{" "}
        <a
          href="https://github.com/infowijs/mapitout"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
        .
      </p>
    </StyledContentSegment>
    <StyledContentSegment>
      <h1>Een paar disclaimers</h1>
      <ul>
        <li>
          “Pinpoints” op de kaart. Omdat pinpoints die door Google op de kaart
          geplaatst zijn soms verder weg liggen dan in werkelijkheid, kan het
          resultaat van een zoekvraag anders zijn dan verwacht. Een oplossing
          kan zijn om als je meerdere suggesties voor bijv. een station krijgt
          verschillende opties te proberen om te zien of het resultaat daarmee
          verandert.
        </li>
        <li>
          Houd er rekening mee dat de tool geen real-time tool is. De tool toont
          het resultaat (bereik) ervan uitgaande dat de reis met het OV plaats
          vindt op elk moment binnen een bepaalde tijdspanne van twee uur
          overdag, maar houdt geen rekening met het precieze moment dat je wilt
          reizen. Het kan zijn dat de eigenlijke reis langer duurt, of dat er
          geen openbaar vervoer is op een bepaalde tijd, of dat je langer op een
          trein moet wachten. Ga daarom van real-time travel platforms om zeker
          te zijn dat je je bestemming op een specifiek moment kunt bereiken
          (zoals{" "}
          <a href="https://9292.nl/" target="_blank" rel="noopener noreferrer">
            www.9292.nl/
          </a>
          ).
        </li>
        <li>
          De vorm van het bereik (als resultaat van je zoekvraag) is enigszins
          aangepast, het aantal punten is beperkt om deprestatie van de tool te
          verbeteren. De resterende punten worden strak getrokken tot nette lijn
          gebaseerd op het niveau van inzoomen.
        </li>
      </ul>
    </StyledContentSegment>
    <StyledContentSegment>
      <h1>Vragen?</h1>
      <p>
        Voor vragen en suggesties ontvangen wij graag graag een mail (met
        vermelding MapitOut tool) op mailadres{" "}
        <a
          href="mailto:welcome@amsterdam.nl"
          target="_blank"
          rel="noopener noreferrer"
        >
          welcome@amsterdam.nl
        </a>
        .
      </p>
    </StyledContentSegment>
  </>
);
