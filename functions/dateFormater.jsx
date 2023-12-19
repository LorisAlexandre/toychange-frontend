export default function dateFormater(dateString) {
  // Création d'un objet Date à partir de la chaîne
  var dateObj = new Date(dateString);

  // Obtention de l'heure au format HH:mm
  var heure =
    ("0" + dateObj.getHours()).slice(-2) +
    ":" +
    ("0" + dateObj.getMinutes()).slice(-2);

  // Obtention de la date au format JJ/MM/AAAA
  var date =
    ("0" + dateObj.getDate()).slice(-2) +
    "/" +
    ("0" + (dateObj.getMonth() + 1)).slice(-2) +
    "/" +
    dateObj.getFullYear();

  // Construction de l'objet résultat
  var resultat = {
    heure: heure,
    date: date,
  };

  return resultat;
}
