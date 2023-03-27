const linkMask = new RegExp('^(https?:\\/\\/)?'
+ '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'
+ '((\\d{1,3}\\.){3}\\d{1,3}))'
+ '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'
+ '(\\?[;&a-z\\d%_.~+=-]*)?'
+ '(\\#[-a-z\\d_]*)?$', 'i');

const emailMask = new RegExp('^([A-z0-9_.-]{1,})'
+ '@'
+ '([A-z0-9_.-]{1,})'
+ '.'
+ '([A-z]{2,8})$');

module.exports = {
  linkMask,
  emailMask,
};
