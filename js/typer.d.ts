export type Skarm = 'telefon' | 'platta' | 'skrivbord';
export type Atgard = (mal: HTMLElement, handelse: Event) => void;
export type Stoppa = () => void;

export interface Komponent {
  readonly namn: string;
  readonly skarmar?: readonly Skarm[];
  readonly atgarder?: Readonly<Record<string, Atgard>>;
  starta(rot: HTMLElement): Stoppa;
}
