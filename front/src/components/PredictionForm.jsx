import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Lock, Trophy } from 'lucide-react';
import * as predictionService from '@/api/predictionService';
import { cn } from '@/lib/utils';

const PredictionForm = ({ match, userId, isLocked, onPredictionSubmit }) => {
  const [prediction, setPrediction] = useState(null);
  const [existingPrediction, setExistingPrediction] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (userId && match) {
      const existing = predictionService.getUserMatchPrediction(userId, match.id);
      setExistingPrediction(existing);
      if (existing) {
        setPrediction(existing.prediction);
      }
    }
  }, [userId, match]);

  const handleSubmit = () => {
    if (!prediction) {
      toast({
        title: "Sélectionnez un résultat",
        description: "Veuillez choisir votre prédiction",
        variant: "destructive"
      });
      return;
    }

    if (isLocked) {
      toast({
        title: "Prédiction verrouillée",
        description: "Le match commence dans moins de 5 minutes",
        variant: "destructive"
      });
      return;
    }

    const result = predictionService.submitMatchPrediction(userId, match.id, prediction);
    
    toast({
      title: existingPrediction ? "Prédiction mise à jour !" : "Prédiction enregistrée !",
      description: "Votre pronostic a été sauvegardé",
    });

    if (onPredictionSubmit) {
      onPredictionSubmit(result);
    }
  };

  if (!match) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-gray-900 font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary-blue" />
          Votre prédiction
        </h4>
        {isLocked && (
          <div className="flex items-center gap-1 text-accent-red text-sm font-semibold">
            <Lock className="w-4 h-4" />
            Verrouillé
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Button
          onClick={() => !isLocked && setPrediction('team_a')}
          disabled={isLocked}
          className={cn(
            "h-24 text-sm font-bold transition-all relative overflow-hidden group border-2",
            prediction === 'team_a' 
              ? "bg-primary-blue hover:bg-blue-800 text-white border-primary-blue shadow-lg scale-105 z-10" 
              : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
          )}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8">
              <img src={match.team_a?.logo_url} alt="" className="w-full h-full object-contain" />
            </div>
            <span className="leading-tight">{match.team_a?.name}</span>
          </div>
        </Button>

        <Button
          onClick={() => !isLocked && setPrediction('draw')}
          disabled={isLocked}
          className={cn(
            "h-24 text-sm font-bold transition-all border-2",
            prediction === 'draw' 
              ? "bg-gray-800 hover:bg-gray-900 text-white border-gray-800 shadow-lg scale-105 z-10" 
              : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
          )}
        >
          MATCH NUL
        </Button>

        <Button
          onClick={() => !isLocked && setPrediction('team_b')}
          disabled={isLocked}
          className={cn(
            "h-24 text-sm font-bold transition-all relative overflow-hidden group border-2",
            prediction === 'team_b' 
              ? "bg-primary-blue hover:bg-blue-800 text-white border-primary-blue shadow-lg scale-105 z-10" 
              : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
          )}
        >
          <div className="flex flex-col items-center gap-2">
             <div className="w-8 h-8">
              <img src={match.team_b?.logo_url} alt="" className="w-full h-full object-contain" />
            </div>
            <span className="leading-tight">{match.team_b?.name}</span>
          </div>
        </Button>
      </div>

      <Button 
        onClick={handleSubmit}
        disabled={isLocked || !prediction}
        className="w-full bg-accent-red hover:bg-red-700 text-white py-6 text-lg font-bold shadow-md hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {existingPrediction ? 'METTRE À JOUR' : 'VALIDER'} MA PRÉDICTION
      </Button>
    </div>
  );
};

export default PredictionForm;