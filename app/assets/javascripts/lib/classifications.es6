export class Classifications {
  constructor(classifications) {
    this.classifications = classifications;
  }

  findById(id) {
    return this.classifications.find((classification) => {
      return classification.id === id;
    });
  }
}
