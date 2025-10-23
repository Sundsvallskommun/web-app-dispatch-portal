import { Link, List } from '@sk-web-gui/react';
import { EnumQATags, QAItem } from './help-types';
import NextLink from 'next/link';

export const allQAItems: QAItem[] = [
  {
    id: '1',
    question: 'Vad är Postportalen?',
    answer: (
      <p>
        I vår postportal skickar du post till digitala myndighetsbrevlådor i stället för till fysiska brevlådor. På så
        sätt sparar vi både tid, pengar och vår miljö, bra va?
      </p>
    ),
    tags: [EnumQATags.SMS, EnumQATags.MAIL, EnumQATags.REK_MAIL],
  },
  {
    id: '2',
    question: 'Hur skickar jag brev i Postportalen?',
    answer: (
      <>
        <p>
          Skriv in personnumret, använd tolv siffror. Om mottagaren har digital brevlåda skickas filen till den. Om
          mottagaren saknar digital brevlåda skickas filen som brevpost till mottagarens folkbokföringsadress.
        </p>
        <p>
          Om du inte har tillgång till personnumret går det bra att skriva in mottagarens adress. I det fallet kommer
          filen att skickas direkt som brevpost till den adressen.
        </p>
      </>
    ),
    tags: [EnumQATags.MAIL, EnumQATags.REK_MAIL],
  },
  {
    id: '3',
    question: 'Vilka rutiner gäller för dokument som skickas i Postportalen?',
    answer: (
      <p>
        Du måste följa din verksamhets informationshanteringsplan. I den beskriver varje verksamhet hur du ska hantera
        dokument som är av olika säkerhetsklassningar. Postportalen är godkänd för hantering av dokument med
        säkerhetsklass 3.
      </p>
    ),
    tags: [EnumQATags.SMS, EnumQATags.MAIL, EnumQATags.REK_MAIL],
  },
  {
    id: '4',
    question: 'Vad gäller för undertecknande av beslut?',
    answer: (
      <p>
        Många beslut kan skickas genom Postportalen utan att de först behöver undertecknas. Dock gäller det inte alla
        beslut. Därför behöver varje verksamhet ta eget ansvar för att kontrollera vad som gäller.
      </p>
    ),
    tags: [EnumQATags.SMS, EnumQATags.MAIL, EnumQATags.REK_MAIL],
  },
  {
    id: '5',
    question: 'Vad gäller för skyddade personuppgifter?',
    answer: (
      <p>
        Postportalen hanterar inte post till personer med skyddade personuppgifter. Om du skulle råka skriva in ett
        personnummer som tillhör en person med skyddade personuppgifter går det inte att komma vidare.
      </p>
    ),
    tags: [EnumQATags.MAIL, EnumQATags.REK_MAIL],
  },
  {
    id: '6',
    question: 'Hur skapar jag en tillgänglig pdf?',
    answer: (
      <>
        <p>
          Det vanligaste sättet att skapa en pdf är att spara om ett dokument från Word till pdf-format. Gå till fliken
          Arkiv, klicka på Spara som, Fler alternativ och välj pdf på listan. Klicka på Alternativ och se till att
          rutorna Skapa bokmärken, Dokumentegenskaper och Visa taggar för dokumentstruktur är ikryssade.
        </p>
        <p>
          Innan du gör det, kontrollera att dokumentet är tillgängligt genom att använda Microsofts hjälpfunktion, och
          skriva in ”Tillgänglighetskontroll” i sökrutan. Då får du anvisningar om vad som eventuellt behöver göras
          direkt i dokumentet.
        </p>
        <p>De viktigaste punkterna är att:</p>
        <List listStyle="bullet">
          <List.Item>
            <List.Text>Använda rubrikformat, och i rätt ordning (i fallande storlek) </List.Text>
          </List.Item>
          <List.Item>
            <List.Text>Ange alt-texter för bilder och icke textbaserat innehåll </List.Text>
          </List.Item>
          <List.Item>
            <List.Text>Använd listverktyget för listor, ta ett av listformaten bland formatmallarna. </List.Text>
          </List.Item>
          <List.Item>
            <List.Text>Formatera tabeller med rubrikrad och alt-text. </List.Text>
          </List.Item>
          <List.Item>
            <List.Text>
              Alla länkar i dokumentet ska vara klickbara. Om dina länkar inte blivit automatiskt klickbara måste du
              markera länktexten, högerklicka och välja länk.
            </List.Text>
          </List.Item>
          <List.Item>
            <List.Text>
              När du sparar, ange titel och författare på dokumentet. Titeln ska tydligt beskriva vad dokumentet handlar
              om. Organisationens namn ska normalt stå som författare.
            </List.Text>
          </List.Item>
        </List>
      </>
    ),
    tags: [EnumQATags.DOCUMENTS],
  },
  {
    id: '7',
    question: 'Skriver Servicecenter administration ut i färg?',
    answer: <p>Ja, de skriver ut i det format och i färg eller svartvit beroende på beställning.</p>,
    tags: [],
  },
  {
    id: '8',
    question: 'Vad kostar utskrift och porto?',
    answer: (
      <p>
        Porto för en normalförsändelse med brev under 50 gram ligger på 15,00 kronor. Med utskriftskostnad blir det en
        totalkostnad på minimum 17,28 kr.
      </p>
    ),
    tags: [EnumQATags.MAIL, EnumQATags.REK_MAIL],
  },
  {
    id: '9',
    question: 'Vad kostar det att skicka post till digital postlåda?',
    answer: (
      <p>
        Kostnaden för att skicka dokument till digital postlåda är 1.50 kr – 3.00 kr. Kostnaden baseras på antal utskick
        som görs per månad.
      </p>
    ),
    tags: [EnumQATags.MAIL, EnumQATags.REK_MAIL],
  },
  {
    id: '10',
    question: 'Vad gäller för avlidna/dödsbon?',
    answer: (
      <p>
        Avlidnas personnummer kan inte hanteras i postportalen. Om du skulle råka skriva in ett personnummer som tillhör
        en avliden person går det inte att komma vidare.
      </p>
    ),
    tags: [EnumQATags.MAIL, EnumQATags.REK_MAIL],
  },
  {
    id: '11',
    question: 'Vad gäller för minderåriga?',
    answer: (
      <p>
        Minderåriga kan inte ta emot post från myndigheter digitalt. Om du skulle råka skriva in ett personnummer som
        tillhör en minderårig person går det inte att komma vidare.
      </p>
    ),
    tags: [],
  },
  {
    id: '12',
    question: 'Vad är en delgivning?',
    answer: (
      <p>
        Med delgivning menas att en handling eller information om ett beslut lämnas till en viss person. Det vanligaste
        sättet att delge är att handlingen skickas med post till den personen som ska delges, men vissa typer av
        delgivningar går att skicka via digital post.
      </p>
    ),
    tags: [],
  },
  {
    id: '13',
    question: 'När kan en delgivning skickas via Postportalen?',
    answer: <p>En delgivning kan skickas via Postportalen om det gäller en förenklad delgivning.</p>,
    tags: [],
  },
  {
    id: '14',
    question: 'Vad är en förenklad delgivning?',
    answer: (
      <>
        <p>
          En förenklad delgivning är en form av delgivning där mottagaren inte behöver bekräfta att denne blivit
          delgiven. När något skickas med förenklad delgivning skickas det först ut ett brev med den handling som
          personen ska ta del av och dagen efter skickas en bekräftelse på att brevet har skickats från avsändaren. Om
          en förenklad delgivning skickas digitalt behöver avsändaren inte skicka en bekräftelse.
        </p>

        <p>
          Förenklad delgivning får användas av en myndighet vid delgivning med den som är part eller har liknande
          ställning i ett mål eller ärende, om denne har fått information av myndigheten om att delgivningssättet kan
          komma att användas i målet eller ärendet.
        </p>
      </>
    ),
    tags: [],
  },
  {
    id: '15',
    question: 'Vad är en vanlig delgivning?',
    answer: (
      <p>
        En vanlig delgivning behöver på något sätt bekräftas av mottagaren. Det behöver då finnas någon form av funktion
        för att personen ska kunna bekräfta mottagandet av delgivningen, antingen via exempelvis BankID eller QR-kod.
        Det finns inga direkta krav på hur bekräftandet av mottagaren ska gå till, men det ska gå att bevisa att en
        specifik person har blivit delgiven.
      </p>
    ),
    tags: [],
  },
  {
    id: '16',
    question: 'Hur komprimerar jag mina filer?',
    answer: (
      <p>
        Du kan själv komprimera din pdf. Öppna programmet där du skapat din pdf. Välj Arkiv och sedan Minska filstorlek
        eller Komprimera PDF. Spara filen.
      </p>
    ),
    tags: [],
  },
  {
    id: '17',
    question: 'Kan jag skicka flera filer?',
    answer: (
      <p>
        Du kan som mest skicka fyra filer, och storleken på det du skickar kan som mest vara 1.5 MB. Om du behöver
        skicka fler eller större filer måste du tyvärr skicka dem med fysisk post.
      </p>
    ),
    tags: [],
  },
  {
    id: '18',
    question: 'Hur skapar jag en mottagarlista?',
    answer: (
      <>
        <p>
          Öppna ett nytt exceldokument och skriv in personnumren i den första kolumnen. Fyll i med tolv siffror, med
          eller utan bindestreck. Välj sedan att exportera excelfilen till formatet .csv och ange semikolon som
          separator. När du sparat filen kan du dra den till det markerade området, eller välja att bläddra fram den.
        </p>
        <p>
          Kontrollera gärna din mottagarlista i t ex Notepad/Anteckningar efter du skapat den, för att se att den ser ut
          som den ska, eftersom Excel ibland formaterar om exempelvis personnummer.
        </p>
        <p>
          Använd gärna <Link href="/files/example.csv">exempelfilen</Link> när du skapar din mottagarlista.
        </p>
      </>
    ),
    tags: [EnumQATags.RECIPIENTS],
  },
  {
    id: '19',
    question: 'Vad ska jag skriva i fältet för ämne?',
    answer: (
      <p>
        Fyll i vad ditt utskick innehåller, till exempel Besked om förskoleplats eller Beslut om din ansökan om bygglov.
        Du behöver inte skriva vilken förvaltning posten skickas från.
      </p>
    ),
    tags: [EnumQATags.SENDER],
  },
  {
    id: '20',
    question: 'Varför syns uppgift om min förvaltning?',
    answer: (
      <p>
        Din förvaltning kommer inte visas i utskicket. Om mottagaren av din post inte har anslutit sig till en digital
        myndighetsbrevlåda skickas i stället en beställning till kontorsservice som skriver ut och skickar posten med
        vanlig, fysisk post. I dessa fall behövs uppgifter om din förvaltningstillhörighet.
      </p>
    ),
    tags: [EnumQATags.SENDER],
  },
  {
    id: '21',
    question: 'Tänk på det här innan du skickar',
    answer: (
      <p>
        Mottagaren använder antagligen sin mobiltelefon för att öppna och läsa sin post. Tänk därför en extra gång på
        tillgänglighet och mängden text i dokumenten. Kanske finns det möjlighet att hänvisa till sidor med allmän
        information i stället för att skicka långa löptexter? Läs mer om tillgänglighet under{' '}
        <NextLink href="/help" passHref legacyBehavior>
          <Link>Hjälp.</Link>
        </NextLink>
      </p>
    ),
    tags: [EnumQATags.DOCUMENTS],
  },
  {
    id: '22',
    question: 'Vilka filformat är tillåtna?',
    answer: (
      <p>
        Du kan skicka din post i formatet pdf. Tänk på att göra pdf:en tillgänglig. Läs mer om tillgängliga dokument
        under{' '}
        <NextLink href="/help" passHref legacyBehavior>
          <Link>Hjälp.</Link>
        </NextLink>{' '}
      </p>
    ),
    tags: [EnumQATags.DOCUMENTS],
  },
  {
    id: '23',
    question: 'Var skickar jag tekniska frågor och felanmälan?',
    answer: (
      <>
        <p>Vid tekniska frågor, problem och felanmälan hör du av dig till IT-support.</p>
        <p>
          <strong>Kontaktuppgifter till IT-support:</strong>
        </p>
        <p>Telefon: 060-19 15 00</p>
        <p>
          E-post:{' '}
          <a className="text-vattjom-text-primary" href="support@sundsvall.se">
            support@sundsvall.se
          </a>
        </p>
      </>
    ),
    tags: [EnumQATags.DOCUMENTS],
  },
  {
    id: '24',
    question: 'Hur ska jag hantera dokumentet som har säkerhetsklass 3?',
    answer: (
      <>
        <p>
          Det är viktigt att dokument som innehåller säkerhetsklass 3-information hanteras lokalt på din dator. Det
          betyder att både platsen du väljer att ladda ner dokumentet till och det program du använder behöver finnas på
          din dator och inte i en molntjänst. Det här gäller även om du behöver ändra formatet på dokumentet.
        </p>
        <p>
          När dokumentet är färdigt raderar du det permanent från din dator. Det går att göra via kortkommandot: Shift +
          Delete. Raderas det utan kortkommandot måste du gå in i papperskorgen och även radera det där.
        </p>
      </>
    ),
    tags: [EnumQATags.DOCUMENTS],
  },
  {
    id: '25',
    question: 'Vilka säkerhetsrutiner gäller för dokument som skickas i Postportalen?',
    answer: (
      <p>
        Du måste följa din verksamhets informationshanteringsplan. I den beskriver varje verksamhet hur du ska hantera
        dokument som är av olika säkerhetsklassningar. Postportalen är godkänd för hantering av dokument med
        säkerhetsklass 3.
      </p>
    ),
    tags: [EnumQATags.DOCUMENTS],
  },
  {
    id: '26',
    question: 'Hur skickas filer från Public 360?',
    answer: (
      <p>
        I diariesystemet Public 360 är det möjligt att dra de pdf-filer du önskar skicka direkt från sidopanelen till
        Postportalen.
      </p>
    ),
    tags: [EnumQATags.DOCUMENTS],
  },
  {
    id: '27',
    question: 'Tänk på det här innan du skickar ditt sms',
    answer: (
      <>
        <p>Tänk en extra gång tonen och på mängden text i ditt meddelande. Skriv begripligt, tydligt och vänligt.</p>
        <p>
          Inled alltid med Hej och beskriv tydligt vad du vill säga. Organisationens namn kommer stå som avsändare så
          vid behov behöver du skriva vilken enhet/förvaltning/avdelning du skickar från.
        </p>

        <p>Exempel:</p>

        <p>Hej!</p>
        <p>
          Du har fått ett nytt meddelande kopplat till ditt Sundsvallsförslag. Läs mer på Mina sidor på Sundsvall.se.
        </p>

        <p>Hej!</p>
        <p>
          Din dator har nu ominstallerats och du kan hämta den hos Digitalisering och IT på Tivolivägen 10. Ring på
          klockan när du kommer. Välkommen!
        </p>
      </>
    ),
    tags: [EnumQATags.SMS],
  },
  {
    id: '28',
    question: 'Hur lägger jag till flera mottagare i sms-tjänsten?',
    answer: (
      <p>När du skrivit ditt meddelande kan du lägga till ett eller flera telefonnummer innan du klickar på skicka.</p>
    ),
    tags: [EnumQATags.SMS],
  },
];
