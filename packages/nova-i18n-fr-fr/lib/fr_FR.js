import fr from 'react-intl/locale-data/fr';
import { addLocaleData } from 'react-intl';

addLocaleData([...fr]);

Telescope.strings.fr = {
  "forms.submit": "Soumettre",
  "forms.cancel": "Annuler",

  "posts.new_post": "Nouveau Post",
  "posts.edit": "Editer",
  "posts.delete": "Supprimer",
  "posts.delete_confirm": "Supprimer le post “{title}”?",
  "posts.delete_success": "Post “{title}” supprimé.",
  "posts.title": "Titre",
  "posts.url": "URL",
  "posts.body": "Corps",
  "posts.categories": "Catégories",
  "posts.thumbnailUrl": "URL de l'aperçu",
  "posts.status": "Statut",
  "posts.load_more": "Charger Plus",
  "posts.search": "Rechercher",
  "posts.view": "Vue",
  "posts.top": "Populaires",
  "posts.new": "Nouveaux",
  "posts.best": "Meilleurs",
  "posts.pending": "En Attente",
  "posts.rejected": "Rejeté",
  "posts.scheduled": "Planifié",
  "posts.daily": "Jour par jour",

  "comments.comments": "Commentaires",
  "comments.count": "{count, plural, =0 {Pas de commentaires} one {# commentaire} other {# commentaires}}",
  "comments.new": "Nouveau Commentaire",
  "comments.no_comments": "Pas de commentaires.",
  "comments.reply": "Répondre",
  "comments.edit": "Editer",
  "comments.delete": "Supprimer",
  "comments.delete_confirm": "Supprimer le commentaire “{body}”?",
  "comments.delete_success": "Commentaire “{body}” supprimé.",
  "comments.please_log_in": "Veuillez vous connecter pour laisser un commentaire.",

  "users.profile": "Profil",
  "users.edit_account": "Editer le compte",
  "users.log_out": "Déconnexion",

  "categories": "bar",

  "settings": "Réglages",
  "settings.json_message": "Note: les réglages déjà spécifié dans le fichier <code>settings.json</code> seront désactivés.",
  "settings.edit": "Editer les réglages",
  "settings.edited": "Réglages édités (veuillez rafraichir la page).",

  "app.loading": "Chargement…",
  "app.404": "Désolé, le contenu demandé n'a pas été trouvé.",
  "app.powered_by": "Propulsé par Telescope",
}