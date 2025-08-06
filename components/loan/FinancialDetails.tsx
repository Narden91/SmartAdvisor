import React from 'react';
import { FinancialProduct, AllLoanInputs } from '../../types';
import InputField from './InputField';

interface FinancialDetailsProps {
  product: FinancialProduct;
  inputs: AllLoanInputs;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const fieldTooltips: Record<keyof AllLoanInputs, string> = {
  capitale: "L'importo che desideri richiedere in prestito. Considera attentamente le tue esigenze reali per evitare di indebitarti oltre il necessario.",
  tan: "Tasso Annuo Nominale: il tasso di interesse puro applicato al prestito, senza considerare le spese accessorie. Confronta sempre i TAN di diverse offerte.",
  durataMesi: "Il periodo di rimborso del prestito in mesi. Durate più lunghe comportano rate più basse ma interessi totali maggiori.",
  speseIstruttoria: "Costi una tantum per l'analisi della pratica e l'apertura del finanziamento. Spesso sono negoziabili.",
  costiAssicurativi: "Costi per eventuali assicurazioni collegate al prestito (es. vita, infortuni). Verifica se sono obbligatorie o facoltative.",
  speseIncassoRata: "Commissione applicata per ogni rata pagata, spesso per bonifici automatici. Può incidere significativamente sul costo totale.",
  premioAssicurativo: "Premio mensile per l'assicurazione sulla cessione del quinto. Include generalmente copertura vita e perdita impiego.",
  commissioniIntermediazione: "Commissioni pagate all'intermediario finanziario per la gestione della pratica. Spesso sono negoziabili.",
  speseGestionePratica: "Costi amministrativi per la gestione del finanziamento. Verifica cosa includono esattamente.",
  spread: "Margine applicato dalla banca al tasso di riferimento. È la parte negoziabile del tasso finale del mutuo.",
  parametroRiferimento: "Tasso di riferimento del mercato (es. Euribor, IRS). Varia nel tempo e influenza la rata nei mutui a tasso variabile.",
  costiNotarili: "Spese per il notaio obbligatorie per l'atto di mutuo. Include imposte, onorari notarili e visure catastali.",
  assicurazioneObbligatoria: "Assicurazione incendio e scoppio obbligatoria per legge sui mutui. Il costo varia in base al valore dell'immobile.",
  impostaSostitutiva: "Tassa statale pari allo 0,25% del capitale finanziato per i mutui prima casa, 2% per altri immobili.",
  liquidSavings: "I tuoi risparmi immediatamente disponibili in conti correnti o depositi. Non include investimenti che richiedono vendita.",
  portfolio: "Dettagli sui tuoi investimenti attuali. Importante per valutare se conviene usare i risparmi o richiedere un finanziamento."
};

const FinancialDetails: React.FC<FinancialDetailsProps> = React.memo(({ product, inputs, onInputChange }) => {
  const renderProductFields = () => {
    switch(product) {
      case 'Prestito':
        return (
          <>
            <InputField 
              label="Capitale Richiesto (C)" 
              name="capitale" 
              value={inputs.capitale} 
              onChange={onInputChange} 
              adornment="€" 
              tooltip={fieldTooltips.capitale}
            />
            <InputField 
              label="TAN (%)" 
              name="tan" 
              value={inputs.tan} 
              onChange={onInputChange} 
              adornment="%" 
              tooltip={fieldTooltips.tan}
            />
            <InputField 
              label="Durata (mesi)" 
              name="durataMesi" 
              value={inputs.durataMesi} 
              onChange={onInputChange} 
              adornment="mesi" 
              placeholder="es. 60" 
              tooltip={fieldTooltips.durataMesi}
            />
            <InputField 
              label="Spese Istruttoria" 
              name="speseIstruttoria" 
              value={inputs.speseIstruttoria} 
              onChange={onInputChange} 
              adornment="€" 
              tooltip={fieldTooltips.speseIstruttoria}
            />
            <InputField 
              label="Costi Assicurativi" 
              name="costiAssicurativi" 
              value={inputs.costiAssicurativi} 
              onChange={onInputChange} 
              adornment="€" 
              tooltip={fieldTooltips.costiAssicurativi}
            />
            <InputField 
              label="Spese Incasso Rata" 
              name="speseIncassoRata" 
              value={inputs.speseIncassoRata} 
              onChange={onInputChange} 
              adornment="€" 
              tooltip={fieldTooltips.speseIncassoRata}
            />
          </>
        );
      case 'Finanziaria':
        return (
          <>
            <InputField 
              label="Capitale Richiesto (C)" 
              name="capitale" 
              value={inputs.capitale} 
              onChange={onInputChange} 
              adornment="€" 
              tooltip={fieldTooltips.capitale}
            />
            <InputField 
              label="TAN (%)" 
              name="tan" 
              value={inputs.tan} 
              onChange={onInputChange} 
              adornment="%" 
              tooltip={fieldTooltips.tan}
            />
            <InputField 
              label="Durata (mesi)" 
              name="durataMesi" 
              value={inputs.durataMesi} 
              onChange={onInputChange} 
              adornment="mesi" 
              placeholder="es. 36" 
              tooltip={fieldTooltips.durataMesi}
            />
            <InputField 
              label="Premio Assicurativo Mensile" 
              name="premioAssicurativo" 
              value={inputs.premioAssicurativo} 
              onChange={onInputChange} 
              adornment="€/mese" 
              tooltip={fieldTooltips.premioAssicurativo}
            />
            <InputField 
              label="Commissioni Intermediazione" 
              name="commissioniIntermediazione" 
              value={inputs.commissioniIntermediazione} 
              onChange={onInputChange} 
              adornment="€" 
              tooltip={fieldTooltips.commissioniIntermediazione}
            />
            <InputField 
              label="Spese Gestione Pratica" 
              name="speseGestionePratica" 
              value={inputs.speseGestionePratica} 
              onChange={onInputChange} 
              adornment="€" 
              tooltip={fieldTooltips.speseGestionePratica}
            />
          </>
        );
      case 'Mutuo':
        return (
          <>
            <InputField 
              label="Capitale Richiesto (C)" 
              name="capitale" 
              value={inputs.capitale} 
              onChange={onInputChange} 
              adornment="€" 
              placeholder="es. 200000" 
              tooltip={fieldTooltips.capitale}
            />
            <InputField 
              label="Spread (%)" 
              name="spread" 
              value={inputs.spread} 
              onChange={onInputChange} 
              adornment="%" 
              tooltip={fieldTooltips.spread}
            />
            <InputField 
              label="Parametro Riferimento (%)" 
              name="parametroRiferimento" 
              value={inputs.parametroRiferimento} 
              onChange={onInputChange} 
              adornment="%" 
              tooltip={fieldTooltips.parametroRiferimento}
            />
            <InputField 
              label="Durata (mesi)" 
              name="durataMesi" 
              value={inputs.durataMesi} 
              onChange={onInputChange} 
              adornment="mesi" 
              placeholder="es. 300" 
              tooltip={fieldTooltips.durataMesi}
            />
            <InputField 
              label="Spese Istruttoria" 
              name="speseIstruttoria" 
              value={inputs.speseIstruttoria} 
              onChange={onInputChange} 
              adornment="€" 
              tooltip={fieldTooltips.speseIstruttoria}
            />
            <InputField 
              label="Costi Notarili" 
              name="costiNotarili" 
              value={inputs.costiNotarili} 
              onChange={onInputChange} 
              adornment="€" 
              tooltip={fieldTooltips.costiNotarili}
            />
            <InputField 
              label="Assicurazione Obbligatoria Mensile" 
              name="assicurazioneObbligatoria" 
              value={inputs.assicurazioneObbligatoria} 
              onChange={onInputChange} 
              adornment="€/mese" 
              tooltip={fieldTooltips.assicurazioneObbligatoria}
            />
            <InputField 
              label="Imposta Sostitutiva" 
              name="impostaSostitutiva" 
              value={inputs.impostaSostitutiva} 
              onChange={onInputChange} 
              adornment="€" 
              tooltip={fieldTooltips.impostaSostitutiva}
            />
          </>
        );
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Dettagli Finanziari</h2>
      <div className="space-y-4">
        {renderProductFields()}
      </div>
    </div>
  );
});

FinancialDetails.displayName = 'FinancialDetails';

export default FinancialDetails;
