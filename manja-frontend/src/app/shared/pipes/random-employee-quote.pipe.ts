import { Pipe, PipeTransform } from '@angular/core';

const beautyQuotes = [
  "La beauté commence au moment où vous décidez d'être vous-même.",
  'Soyez la version la plus belle de vous-même.',
  'La confiance en soi est le meilleur maquillage.',
  "La vraie beauté vient de l'intérieur.",
  'Chaque jour est une occasion de briller.',
  "Souriez, c'est le meilleur accessoire.",
  "La simplicité est la clé de l'élégance.",
  "La beauté est un état d'esprit.",
  "Vous êtes magnifique, ne l'oubliez jamais.",
  'La confiance est le plus beau maquillage.',
  "La beauté est un reflet de l'amour intérieur.",
  "Le maquillage est l'art d'être soi-même.",
  'La beauté est un voyage, pas une destination.',
  "La beauté est dans l'âme de celui qui la contemple.",
  'Chaque visage raconte une histoire.',
  'La beauté est la promesse du bonheur.',
  'Laissez votre lumière intérieure briller.',
  "La simplicité est la clé de l'élégance.",
  'La confiance en soi est le plus beau maquillage.',
  "La beauté est un état d'esprit.",
].sort(() => Math.random() - 0.5);

@Pipe({
  name: 'randomEmployeeQuote',
})
export class RandomEmployeeQuotePipe implements PipeTransform {
  transform(employeeIndex: number): string {
    return beautyQuotes[employeeIndex % beautyQuotes.length];
  }
}
