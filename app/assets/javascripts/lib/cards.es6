export class Cards {
  constructor(cards) {
    this.cards = cards;
  }

  toOptions() {
    return this.cards.map((card) => {
      return {
        label: card.name,
        value: card.id
      };
    });
  }
}
