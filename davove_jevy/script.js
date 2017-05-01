/**
 * Created by adrijaned on 1.5.17.
 */

var current = 0;
var img_sources = [
    'img/0.jpg',
    'img/0.jpg',
    'img/1.jpg',
    'img/1.jpg',
    'img/2.jpg',
    'img/2.jpg',
    'img/3.jpg',
    'img/3.jpg'];
var paragraph_sources = [

    '<b>Masové jevy</b><br/>' +
    ' - hromadné chování skupiny lidí<br/>' +
    ' - vyvoláno působením neobvyklých životních situací<br/>' +
    ' - masové šílenství, masová hysterie...',

    '<b>Charakteristika masových jevů</b><br/>' +
    'Masové jevy:<br/>' +
    ' - vznikají zpravidla spontánně<br/>' +
    ' - vyvíjejí se neplánovaně<br/>' +
    ' - jsou neorganizované<br/>' +
    ' - závisí na vzájemné interakci účastníků',

    '<b>Dělení podle typu seskupení</b><br/>' +
    ' - <b>dav</b> - aktivní seskupení<br/>' +
    ' - posluchačstvo - pasivní sekupení<br/>' +
    ' - sociální hnutí - organizované, odlišné od předchozích',

    '<b>Typy davů</b><br/>' +
    ' - agresivní, např. terorizující<br/>' +
    ' - unikající, např. panika<br/>' +
    ' - získávající, např. rabování<br/>' +
    ' - výrazový, např. manifestace',

    '<b>Chování v davu</b><br/>' +
    ' - ztráta osobnosti<br/>' +
    ' - podobné zaměření citů a myšlenek<br/>' +
    ' - tvorba kolektivní duše<br/>' +
    ' - primitivizace davu<br/>' +
    ' - vzrůstající tendence ke konání',

    '<b>Vůdce davu</b><br/>' +
    ' - nejvýznačnější osoba v davu<br/>' +
    ' - zpravidla dav ovládá<br/>' +
    ' - ideálně by měl jít sám příkladem<br/>' +
    ' - ovládá dav ustavičným opakováním tvrzení',

    '<b>Příčiny masového jednání</b><br/>' +
    ' - pocit anonymity<br/>' +
    ' - pocit odvahy z početní převahy<br/>' +
    ' - pocit fascinace vůdcem davu',

    '<b>Bystander fenomén</b><br/>' +
    ' - čím větší dav, tím menší šance na poskytnutí pomoci<br/>' +
    ' - projevuje se např. při nehodách, záplavách'

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