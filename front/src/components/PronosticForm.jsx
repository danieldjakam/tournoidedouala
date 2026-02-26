import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Lock, Trophy, CheckCircle, Loader2 } from 'lucide-react';
import * as pronosticService from '@/api/pronosticService';
import { cn } from '@/lib/utils';
import { differenceInMinutes } from 'date-fns';

const PronosticForm = ({ match, userId, isLocked, onPronosticSubmit }) => {
  const [pronostic, setPronostic] = useState(null);
  const [existingPronostic, setExistingPronostic] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userId && match) {
      const existing = pronosticService.getUserMatchPronostic(userId, match.id);
      setExistingPronostic(existing);
      if (existing) {
        setPronostic(existing.pronostic);
      }
    }
  }, [userId, match]);

  const handleSubmit = async () => {
    if (!pronostic) {
      toast({
        title: "Sélectionnez un résultat",
        description: "Veuillez choisir votre pronostic",
        variant: "destructive"
      });
      return;
    }

    if (isLocked) {
      toast({
        title: "Pronostic verrouillé",
        description: "Le match commence dans moins de 5 minutes",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate server delay
    setTimeout(() => {
      const result = pronosticService.submitMatchPronostic(userId, match.id, pronostic);
      setIsSubmitting(false);
      
      toast({
        title: "✅ Pronostic enregistré !",
        description: "Bonne chance !",
      });

      if (onPronosticSubmit) {
        onPronosticSubmit(result);
      }
    }, 800);
  };

  if (!match) return null;

  // Calculate time until lock
  const minutesUntilLock = differenceInMinutes(new Date(match.kickoff_time), new Date()) - 5;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-gray-900 font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary-blue" />
          Faire un pronostic
        </h4>
        {isLocked ? (
          <div className="flex items-center gap-1 text-accent-red text-xs font-semibold bg-red-50 px-2 py-1 rounded">
            <Lock className="w-3 h-3" />
            Verrouillé
          </div>
        ) : (
           minutesUntilLock > 0 && minutesUntilLock < 60 && (
             <span className="text-xs text-orange-500 font-medium">Ferme dans {minutesUntilLock} min</span>
           )
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Button
          onClick={() => !isLocked && setPronostic('team_a')}
          disabled={isLocked || !!existingPronostic}
          className={cn(
            "h-24 text-sm font-bold transition-all relative overflow-hidden group border-2",
            pronostic === 'team_a' 
              ? "bg-primary-blue hover:bg-blue-800 text-white border-primary-blue shadow-lg scale-105 z-10" 
              : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
          )}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8">
              <img src={match.team_a?.logo_url} alt="" className="w-full h-full object-contain" />
            </div>
            <span className="leading-tight text-[10px] md:text-xs">{match.team_a?.name}</span>
          </div>
          {pronostic === 'team_a' && <CheckCircle className="absolute top-1 right-1 w-4 h-4 text-white" />}
        </Button>

        <Button
          onClick={() => !isLocked && setPronostic('draw')}
          disabled={isLocked || !!existingPronostic}
          className={cn(
            "h-24 text-sm font-bold transition-all border-2",
            pronostic === 'draw' 
              ? "bg-gray-800 hover:bg-gray-900 text-white border-gray-800 shadow-lg scale-105 z-10" 
              : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
          )}
        >
          NUL
          {pronostic === 'draw' && <CheckCircle className="absolute top-1 right-1 w-4 h-4 text-white" />}
        </Button>

        <Button
          onClick={() => !isLocked && setPronostic('team_b')}
          disabled={isLocked || !!existingPronostic}
          className={cn(
            "h-24 text-sm font-bold transition-all relative overflow-hidden group border-2",
            pronostic === 'team_b' 
              ? "bg-primary-blue hover:bg-blue-800 text-white border-primary-blue shadow-lg scale-105 z-10" 
              : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
          )}
        >
          <div className="flex flex-col items-center gap-2">
             <div className="w-8 h-8">
              <img src={match.team_b?.logo_url} alt="" className="w-full h-full object-contain" />
            </div>
            <span className="leading-tight text-[10px] md:text-xs">{match.team_b?.name}</span>
          </div>
          {pronostic === 'team_b' && <CheckCircle className="absolute top-1 right-1 w-4 h-4 text-white" />}
        </Button>
      </div>

      {existingPronostic ? (
         <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center font-medium border border-green-200 flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Pronostic déjà enregistré
         </div>
      ) : (
        <Button 
          onClick={handleSubmit}
          disabled={isLocked || !pronostic || isSubmitting}
          className="w-full bg-accent-red hover:bg-red-700 text-white py-6 text-lg font-bold shadow-md hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Traitement...
            </>
          ) : (
            'VALIDER MON PRONOSTIC'
          )}
        </Button>
      )}
    </div>
  );
};

export default PronosticForm;