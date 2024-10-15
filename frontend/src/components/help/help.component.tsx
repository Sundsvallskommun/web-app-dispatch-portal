import { useMediaQuery } from '@mui/material';
import { Accordion, Link, List, useGui } from '@sk-web-gui/react';
import NextLink from 'next/link';

interface HelpProps {
  show?: 'recipients' | 'documents' | 'sender';
  size?: 'sm' | 'md';
}

export const Help: React.FC<HelpProps> = ({ show, size: _size }) => {
  const gui = useGui();
  const isMedium = useMediaQuery(`screen and (min-width:${gui.theme?.screens?.md})`);

  const size = _size || (isMedium ? 'md' : 'sm');

  const others = (
    <>
      <Accordion.Item header="Vad är Postportalen? ">
        <p>
          I vår postportal skickar du post till digitala myndighetsbrevlådor i stället för till fysiska brevlådor. På så
          sätt sparar vi både tid, pengar och vår miljö, bra va?
        </p>
      </Accordion.Item>
      <Accordion.Item header="Hur fungerar det?">
        <p>
          Om mottagaren har valt att få sin post digitalt skickar postportalen automatiskt till den valda tjänsten,
          exempelvis Kivra. På det här sättet kommer din post fram på bara några sekunder! Om mottagaren inte har
          anslutit sig till en digital myndighetsbrevlåda skickas i stället en beställning till kontorsservice som
          skriver ut och skickar posten med vanlig, fysisk post.
        </p>
      </Accordion.Item>
      <Accordion.Item header="Vilka rutiner gäller för dokument som skickas i Postportalen?">
        <p>
          Varje verksamhet ansvarar för att arbetssätt gällande hantering av sekretess och säkerhetsklassning följs
          enligt gällande informationshanteringsplan.
        </p>
      </Accordion.Item>

      <Accordion.Item header="Vad gäller för undertecknande av beslut?">
        <p>
          Många beslut kan skickas genom Postportalen utan att de först behöver undertecknas. Dock gäller det inte alla
          beslut. Därför behöver varje verksamhet ta eget ansvar för att kontrollera vad som gäller.
        </p>
      </Accordion.Item>
      <Accordion.Item header="Vad gäller för skyddade personuppgifter?">
        <p>
          Postportalen hanterar inte post till personer med skyddade personuppgifter. Om du skulle råka skriva in ett
          personnummer som tillhör en person med skyddade personuppgifter går det inte att komma vidare.
        </p>
      </Accordion.Item>
      <Accordion.Item header="Hur skapar jag en tillgänglig pdf?">
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
      </Accordion.Item>
      <Accordion.Item header="Skriver Servicecenter administration ut i färg?">
        <p>Ja, de skriver ut i det format och i färg eller svartvit beroende på beställning.</p>
      </Accordion.Item>
      <Accordion.Item header="Vad kostar utskrift och porto?">
        <p>
          Porto för en normalförsändelse med brev under 50 gram ligger på 15,00 kronor. Med utskriftskostnad blir det en
          totalkostnad på minimum 17,28 kr.
        </p>
      </Accordion.Item>
      <Accordion.Item header="Vad kostar det att skicka post till digital postlåda?">
        <p>
          Kostnaden för att skicka dokument till digital postlåda är 1.50 kr – 3.00 kr. Kostnaden baseras på antal
          utskick som görs per månad.
        </p>
      </Accordion.Item>
      <Accordion.Item header="Vad gäller för avlidna/dödsbon?">
        <p>
          Avlidnas personnummer kan inte hanteras i postportalen. Om du skulle råka skriva in ett personnummer som
          tillhör en avliden person går det inte att komma vidare.
        </p>
      </Accordion.Item>
      <Accordion.Item header="Vad gäller för minderåriga?">
        <p>
          Minderåriga kan inte ta emot post från myndigheter digitalt. Om du skulle råka skriva in ett personnummer som
          tillhör en minderårig person går det inte att komma vidare.
        </p>
      </Accordion.Item>
      <Accordion.Item header="Vad är en delgivning?">
        <p>
          Med delgivning menas att en handling eller information om ett beslut lämnas till en viss person. Det
          vanligaste sättet att delge är att handlingen skickas med post till den personen som ska delges, men vissa
          typer av delgivningar går att skicka via digital post.
        </p>
      </Accordion.Item>
      <Accordion.Item header="När kan en delgivning skickas via Postportalen?">
        <p>
          En delgivning kan skickas via Postportalen om det gäller en förenklad delgivning eller en vanlig delgivning.
        </p>
      </Accordion.Item>
      <Accordion.Item header="Vad är en förenklad delgivning?">
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
      </Accordion.Item>
      <Accordion.Item header="Vad är en vanlig delgivning?">
        <p>
          En vanlig delgivning behöver på något sätt bekräftas av mottagaren. Det behöver då finnas någon form av
          funktion för att personen ska kunna bekräfta mottagandet av delgivningen, antingen via exempelvis BankID eller
          QR-kod. Det finns inga direkta krav på hur bekräftandet av mottagaren ska gå till, men det ska gå att bevisa
          att en specifik person har blivit delgiven.
        </p>
      </Accordion.Item>
      <Accordion.Item header="Hur komprimerar jag mina filer?">
        <p>
          Du kan själv komprimera din pdf. Öppna programmet där du skapat din pdf. Välj Arkiv och sedan Minska
          filstorlek eller Komprimera PDF. Spara filen.
        </p>
      </Accordion.Item>
      <Accordion.Item header="Kan jag skicka flera filer?">
        <p>
          Du kan som mest skicka fyra filer, och storleken på det du skickar kan som mest vara 2 MB. Om du behöver
          skicka fler eller större filer måste du tyvärr skicka dem med fysisk post.
        </p>
      </Accordion.Item>
    </>
  );
  const recipients = (
    <>
      <Accordion.Item header="Hur skickar jag post till en person?">
        <p>
          Skriv in personnumret till personen du ska skicka till. Skriv personnumren med tolv siffror, utan bindestreck.
        </p>
      </Accordion.Item>
      <Accordion.Item header="Hur skapar jag en mottagarlista?">
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
      </Accordion.Item>
    </>
  );
  const sender = (
    <>
      <Accordion.Item header="Vad ska jag skriva i fältet för ämne?">
        <p>
          Fyll i vad ditt utskick innehåller, till exempel Besked om förskoleplats eller Beslut om din ansökan om
          bygglov. Du behöver inte skriva vilken förvaltning posten skickas från.
        </p>
      </Accordion.Item>
      <Accordion.Item header="Varför syns uppgift om min förvaltning?">
        <p>
          Din förvaltning kommer inte visas i utskicket. Om mottagaren av din post inte har anslutit sig till en digital
          myndighetsbrevlåda skickas i stället en beställning till kontorsservice som skriver ut och skickar posten med
          vanlig, fysisk post. I dessa fall behövs uppgifter om din förvaltningstillhörighet.
        </p>
      </Accordion.Item>
      <Accordion.Item header="Vad händer när jag klickar på skicka?">
        <p>Du får en sammanställning över ditt utskick och kan granska uppgifterna innan du skickar iväg det. </p>
      </Accordion.Item>
    </>
  );
  const documents = (
    <>
      <Accordion.Item header="Tänk på det här innan du skickar">
        <p>
          Mottagaren använder antagligen sin mobiltelefon för att öppna och läsa sin post. Tänk därför en extra gång på
          tillgänglighet och mängden text i dokumenten. Kanske finns det möjlighet att hänvisa till sidor med allmän
          information i stället för att skicka långa löptexter? Läs mer om tillgänglighet under{' '}
          <NextLink href="/help" passHref legacyBehavior>
            <Link>Hjälp.</Link>
          </NextLink>
        </p>
      </Accordion.Item>
      <Accordion.Item header="Vilka filformat är tillåtna?">
        <p>
          Du kan skicka din post i formatet pdf. Tänk på att göra pdf:en tillgänglig. Läs mer om tillgängliga dokument
          under{' '}
          <NextLink href="/help" passHref legacyBehavior>
            <Link>Hjälp.</Link>
          </NextLink>{' '}
        </p>
      </Accordion.Item>
      <Accordion.Item header="Var skickar jag tekniska frågor och felanmälan?">
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
      </Accordion.Item>
      <Accordion.Item header="Hur gör jag formatändring av dokument klass 3?">
        <p>
          I Postportalen skickar du dokument i formatet PDF. Om du behöver ändra format på ett dokument som innehåller
          klass 3-information är det viktigt att hanteringen sker lokalt på din dator. Det betyder att både platsen du
          väljer att ladda ner dokumentet till och det program du använder behöver finnas på din dator och inte i en
          molntjänst.
        </p>
        <p>
          När dokumentet är färdigt raderar du det permanent från din dator. Det går att göra via kortkommandot: Shift +
          Delete. Raderas det utan kortkommandot måste du gå in i papperskorgen och även radera det där.
        </p>
      </Accordion.Item>
    </>
  );

  return (
    <Accordion className="w-full" size={size} allowMultipleOpen>
      {show === 'recipients' ? (
        recipients
      ) : show === 'documents' ? (
        documents
      ) : show === 'sender' ? (
        sender
      ) : (
        <>
          {others}
          {documents}
          {recipients}
          {sender}
        </>
      )}
    </Accordion>
  );
};
