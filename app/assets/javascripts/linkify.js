var linkify = require('linkifyjs');
var linkifyElement = require('linkifyjs/element');

const linkifyFaq = () => {
  const faqList = document.getElementById('faq-list')

  if (faqList) {
    linkifyElement(faqList, linkify.options.defaults, document);
  }
}

document.addEventListener("DOMContentLoaded", linkifyFaq())
