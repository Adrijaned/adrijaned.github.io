/**
 * Created by adrijaned on 1.5.17.
 */

var current = 0;
var img_sources = [
    'img/0.png',
    'img/0.png',
    'img/1.jpg',
    'img/2.jpg',
    'img/3.png',
    'img/4.png',
    'img/5.jpg',
    'img/6.jpg'];
var paragraph_sources = [
    '<b>Sociální inženýrství(Kyberbezpečnost)</b><br/>' +
    'Kyberneticky-bezpečnostní hrozba spočívající v psychologické manipulaci lidí.',
    '<b>Definice</b><br/>' +
    'Sociální inženýrství je v kybernetické bezpečnosti forma psychologického nátlaku ' +
    'nebo manipulace, zpravidla za účelem získání uživatelových dat, nebo k přimění jej ' +
    'k instalaci škodlivého software. K tomuto dochází zpravidla prostřednictvím telefonního ' +
    'spojení, e-mailovou korespondencí, nebo fyzicky.',
    '<b>Pretexting</b><br/>' +
    'Pretexting je technika sociálního inženýrství, při níž se útočník - zpravidla telefonicky' +
    ' - vydává podle předpřipraveného scénáře za jinou autoritativní osobu. K tomuto typu ' +
    'útoku zpravidla potřebuje pouze znát základní - snadno dohledatelné - informace o cílové ' +
    'osobě, jako například adresu, rodné číslo, jména příbuzných apod. S těmito informacemi ' +
    'se poté může vydávat např. za úředníka vyžadujícího vyplnění určitého online dokumentu, ' +
    'nebo za pracovníka lokálního poskytovatele internetového připojení, vyžadujícího ' +
    'instalaci určitého software umožňujícího vyšší kvalitu připojení k internetu.',
    '<b>Phishing</b><br/>' +
    'Phishing je technika sociálního inženýrství spočívající v odesílání zpravidla e-mailů ' +
    'žádajících vyplnění osobních údajů, jako například číslo kreditní karty, pod pohrůžkou ' +
    'postihu, nebude-li žádost splněna. Tato forma sociálního inženýrství nemá takovou ' +
    'účinnost jako Pretexting, avšak Phishingové zprávy je možno odesílat jako spam, a tudíž ' +
    'i to malé procento (cca. 0.15 %) úspěšných pokusů mnohdy stále tvoří větší množství ' +
    'informací, než je možno v rozumném čase získat technikou Pretextingu.',
    '<b>Spear Phishing</b><br/>' +
    'Spear Phishing je forma Phishingu, při níž útočník odesílá pouze menší množství ' +
    'Phishingových zpráv, avšak zaměřených na určitou cílovou skupinu a s personalizovaným ' +
    'obsahem, což výrazně zvyšuje útočníkovu procentuální šanci na úspěch. (např. útočník ' +
    'by všem učitelům VOŠ a SPŠ Žďár nad Sázavou (e-mailové adresy volně dostupné na Internetu' +
    ') poslal zprávu, v níž by se představil jako paní Filipová, a požadoval zaslání ' +
    'přihlašovacích údajů do systému Office 360 na svou adresu z důvodu nutnosti provedení ' +
    'nějakých úprav v systému.) U Spear Phishingových útoků je zpravidla při správném ' +
    'provedení i 35 - 70 % šance na úspěch na jednoho člověka.',
    '<b>Water Holing</b><br/>' +
    'Water Holing je personalizovaný typ útoku, při němž bývá využito důvěry oběti k ' +
    'určité webové stránce. Je-li cíl útoku například opatrný při prohlížení e-mailů, a ' +
    'nekliká na žádné neznámé odkazy, stále je zde šance, že bude následovat odkaz na nějakou ' +
    'svou známou a oblíbenou stránku. Pokud tedy útočník zfalšuje e-mail, aby vypadal jako ' +
    'pravidelně zasílaný mail od oblíbené stránky, a v něm uvede odkaz na svou stránku, - ' +
    'ideálně s URL stejným jako stránka, ale upraveným pro IDN - nebo na XSS napadenou ' +
    'originální stránku, je zde velká šance, že obět na tento mail zareaguje a stránku ' +
    'navštíví.',
    '<b>Baiting</b><br/>' +
    'Baiting je technika sociálního inženýrství odehrávající se  pro změnu ve fyzickém ' +
    'světě. Při tomto typu útoku nastraží útočník například USB flash disk nebo paměťovou ' +
    'kartu, na jejíž interní paměť umístí nakažený soubor. Jakmile oběť flash disk najde, ' +
    'vezme si jej a připojí do svého počítače. V tom okamžiku je na počítač a potenciálně ' +
    'na celou chráněnou síť nahrán virus z daného média.',
    '<b>Quid pro quo</b><br/>' +
    'Quid pro quo neboli něco za něco je typ útoku, kdy se útočník představí jako zpravidla ' +
    'pracovník technické podpory při postupném obvolávání lidí ve firmě. Při tom má vždy ' +
    'určitou šanci, že narazí na někoho, kdo pomoc skutečně potřebuje. V tom případě předstírá' +
    ' snahu pomoci a občas skutečně pro odvedení podezření problém vyřeší, avšak za cenu, že ' +
    'oběť přinutí v průběhu "opravy" provést nějaké příkazy nebo stáhnout software, jenž ' +
    'umožní útočníkovi přístup do systému. Výzkum z roku 2003 navíc ukazuje, že tehdy bylo ' +
    'přes 90 % lidí ochotno dát své přihlašovací údaje neznámé osobě už jen výměnou za ' +
    'čokoládovou tyčinku.'
];
function next() {
    if (current < paragraph_sources.length - 1) {
        current++;
    } else if (current === 5) {
        window.alert('You came to the end, dumbass :)')
    }
    document.getElementById('my_aWeSoMe_image').src = img_sources[current];
    document.getElementById('text_paragraph').innerHTML = paragraph_sources[current];
}
function previous() {
    if (current > 0) {
        current--;
    }
    document.getElementById('my_aWeSoMe_image').src = img_sources[current];
    document.getElementById('text_paragraph').innerHTML = paragraph_sources[current]
}