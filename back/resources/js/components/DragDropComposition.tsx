import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Save, RotateCcw, Users, Copy } from 'lucide-react';

// Postes détaillés avec positions sur le terrain
export const POSTES = {
    // Gardien
    GK: { value: 'GK', label: 'Gardien', category: 'gardien', color: 'bg-yellow-500' },
    
    // Défenseurs
    LB: { value: 'LB', label: 'Arrière Gauche', category: 'defenseur', color: 'bg-blue-500' },
    CB: { value: 'CB', label: 'Défenseur Central', category: 'defenseur', color: 'bg-blue-500' },
    RB: { value: 'RB', label: 'Arrière Droit', category: 'defenseur', color: 'bg-blue-500' },
    LWB: { value: 'LWB', label: 'Piston Gauche', category: 'defenseur', color: 'bg-blue-600' },
    RWB: { value: 'RWB', label: 'Piston Droit', category: 'defenseur', color: 'bg-blue-600' },
    
    // Milieux
    CDM: { value: 'CDM', label: 'Milieu Défensif', category: 'milieu', color: 'bg-green-600' },
    CM: { value: 'CM', label: 'Milieu Central', category: 'milieu', color: 'bg-green-500' },
    CAM: { value: 'CAM', label: 'Milieu Offensif', category: 'milieu', color: 'bg-green-400' },
    LM: { value: 'LM', label: 'Milieu Gauche', category: 'milieu', color: 'bg-green-500' },
    RM: { value: 'RM', label: 'Milieu Droit', category: 'milieu', color: 'bg-green-500' },
    LW: { value: 'LW', label: 'Ailier Gauche', category: 'milieu', color: 'bg-green-400' },
    RW: { value: 'RW', label: 'Ailier Droit', category: 'milieu', color: 'bg-green-400' },
    
    // Attaquants
    ST: { value: 'ST', label: 'Buteur', category: 'attaquant', color: 'bg-red-500' },
    CF: { value: 'CF', label: 'Attaquant Central', category: 'attaquant', color: 'bg-red-500' },
    LF: { value: 'LF', label: 'Attaquant Gauche', category: 'attaquant', color: 'bg-red-400' },
    RF: { value: 'RF', label: 'Attaquant Droit', category: 'attaquant', color: 'bg-red-400' },
} as const;

// Formations prédéfinies avec positions
export const FORMATIONS = {
    '4-4-2': {
        name: '4-4-2 Classique',
        positions: [
            { poste: 'GK', x: 50, y: 95 },
            { poste: 'LB', x: 15, y: 75 },
            { poste: 'CB', x: 35, y: 80 },
            { poste: 'CB', x: 65, y: 80 },
            { poste: 'RB', x: 85, y: 75 },
            { poste: 'LM', x: 15, y: 50 },
            { poste: 'CM', x: 35, y: 55 },
            { poste: 'CM', x: 65, y: 55 },
            { poste: 'RM', x: 85, y: 50 },
            { poste: 'ST', x: 40, y: 20 },
            { poste: 'ST', x: 60, y: 20 },
        ],
    },
    '4-3-3': {
        name: '4-3-3 Offensif',
        positions: [
            { poste: 'GK', x: 50, y: 95 },
            { poste: 'LB', x: 15, y: 75 },
            { poste: 'CB', x: 35, y: 80 },
            { poste: 'CB', x: 65, y: 80 },
            { poste: 'RB', x: 85, y: 75 },
            { poste: 'CDM', x: 50, y: 60 },
            { poste: 'CM', x: 30, y: 45 },
            { poste: 'CM', x: 70, y: 45 },
            { poste: 'LW', x: 15, y: 20 },
            { poste: 'ST', x: 50, y: 15 },
            { poste: 'RW', x: 85, y: 20 },
        ],
    },
    '4-2-3-1': {
        name: '4-2-3-1 Moderne',
        positions: [
            { poste: 'GK', x: 50, y: 95 },
            { poste: 'LB', x: 15, y: 75 },
            { poste: 'CB', x: 35, y: 80 },
            { poste: 'CB', x: 65, y: 80 },
            { poste: 'RB', x: 85, y: 75 },
            { poste: 'CDM', x: 40, y: 60 },
            { poste: 'CDM', x: 60, y: 60 },
            { poste: 'LM', x: 20, y: 40 },
            { poste: 'CAM', x: 50, y: 35 },
            { poste: 'RM', x: 80, y: 40 },
            { poste: 'ST', x: 50, y: 15 },
        ],
    },
    '3-5-2': {
        name: '3-5-2',
        positions: [
            { poste: 'GK', x: 50, y: 95 },
            { poste: 'CB', x: 30, y: 80 },
            { poste: 'CB', x: 50, y: 82 },
            { poste: 'CB', x: 70, y: 80 },
            { poste: 'LWB', x: 10, y: 55 },
            { poste: 'CM', x: 35, y: 55 },
            { poste: 'CM', x: 50, y: 50 },
            { poste: 'CM', x: 65, y: 55 },
            { poste: 'RWB', x: 90, y: 55 },
            { poste: 'ST', x: 40, y: 20 },
            { poste: 'ST', x: 60, y: 20 },
        ],
    },
    '4-1-4-1': {
        name: '4-1-4-1 Défensif',
        positions: [
            { poste: 'GK', x: 50, y: 95 },
            { poste: 'LB', x: 15, y: 75 },
            { poste: 'CB', x: 35, y: 80 },
            { poste: 'CB', x: 65, y: 80 },
            { poste: 'RB', x: 85, y: 75 },
            { poste: 'CDM', x: 50, y: 65 },
            { poste: 'LM', x: 15, y: 45 },
            { poste: 'CM', x: 35, y: 50 },
            { poste: 'CM', x: 65, y: 50 },
            { poste: 'RM', x: 85, y: 45 },
            { poste: 'ST', x: 50, y: 15 },
        ],
    },
    '3-4-3': {
        name: '3-4-3 Offensif',
        positions: [
            { poste: 'GK', x: 50, y: 95 },
            { poste: 'CB', x: 30, y: 80 },
            { poste: 'CB', x: 50, y: 82 },
            { poste: 'CB', x: 70, y: 80 },
            { poste: 'LM', x: 15, y: 50 },
            { poste: 'CM', x: 40, y: 55 },
            { poste: 'CM', x: 60, y: 55 },
            { poste: 'RM', x: 85, y: 50 },
            { poste: 'LW', x: 20, y: 25 },
            { poste: 'ST', x: 50, y: 15 },
            { poste: 'RW', x: 80, y: 25 },
        ],
    },
} as const;

export type FormationKey = keyof typeof FORMATIONS;
export type PosteKey = keyof typeof POSTES;

interface Player {
    id: number;
    prenom: string;
    nom: string;
    numero: string;
}

interface CompositionPlayer {
    id: string;
    player_id: number;
    player: Player;
    poste: PosteKey;
    titulaire: boolean;
    minutes: number | null;
    x: number;
    y: number;
}

interface DragDropCompositionProps {
    teamId: number;
    teamName: string;
    teamPlayers: Player[];
    initialCompositions: CompositionPlayer[];
    teamColor: string;
    onSave: (compositions: CompositionPlayer[]) => void;
}

export function DragDropComposition({
    teamId,
    teamName,
    teamPlayers,
    initialCompositions,
    teamColor,
    onSave,
}: DragDropCompositionProps) {
    const [selectedFormation, setSelectedFormation] = useState<FormationKey>('4-4-2');
    const [draggedPlayer, setDraggedPlayer] = useState<Player | null>(null);
    const [draggedFromBench, setDraggedFromBench] = useState<CompositionPlayer | null>(null);
    const [activeTab, setActiveTab] = useState<'terrain' | 'liste'>('terrain');

    // Initialiser les compositions avec toutes les positions de la formation
    const [compositions, setCompositions] = useState<CompositionPlayer[]>(() => {
        const formation = FORMATIONS[selectedFormation];
        return formation.positions.map((pos, index) => {
            const initialCompo = initialCompositions[index];
            return {
                id: initialCompo?.id || `pos-${index}`,
                player_id: initialCompo?.player_id || 0,
                player: initialCompo?.player || { id: 0, prenom: '', nom: '', numero: '' },
                poste: initialCompo?.poste || (pos.poste as PosteKey),
                titulaire: initialCompo?.titulaire ?? true,
                minutes: initialCompo?.minutes ?? null,
                x: pos.x,
                y: pos.y,
            };
        });
    });

    const titulaires = compositions.filter((c) => c.titulaire);
    const remplacants = compositions.filter((c) => !c.titulaire);
    const nonSelectionnes = teamPlayers.filter(
        (p) => !compositions.find((c) => c.player_id === p.id)
    );

    // Appliquer une formation
    const applyFormation = useCallback(() => {
        const formation = FORMATIONS[selectedFormation];
        setCompositions((prev) => {
            return formation.positions.map((pos, index) => {
                const existingCompo = prev[index];
                return {
                    id: existingCompo?.id || `pos-${index}`,
                    player_id: existingCompo?.player_id || 0,
                    player: existingCompo?.player || { id: 0, prenom: '', nom: '', numero: '' },
                    poste: pos.poste as PosteKey,
                    titulaire: existingCompo !== undefined ? existingCompo.titulaire : true,
                    minutes: existingCompo?.minutes ?? null,
                    x: pos.x,
                    y: pos.y,
                };
            });
        });
    }, [selectedFormation]);

    // Gérer le drop d'un joueur sur une position (depuis l'extérieur ou le banc)
    const handleDropOnPosition = useCallback((index: number) => {
        setCompositions((prev) => {
            const formation = FORMATIONS[selectedFormation];
            const pos = formation.positions[index];

            if (!pos) return prev;

            const newCompositions = [...prev];
            const existingCompo = newCompositions[index];

            // Cas 1: Drop depuis un joueur non sélectionné
            if (draggedPlayer) {
                if (existingCompo && existingCompo.player_id !== 0) {
                    const existingPlayer = teamPlayers.find((p) => p.id === existingCompo.player_id);
                    if (existingPlayer) {
                        const isAlreadyBench = prev.some((c) => c.player_id === existingPlayer.id && !c.titulaire);
                        if (!isAlreadyBench) {
                            existingCompo.titulaire = false;
                            existingCompo.x = 5;
                            existingCompo.y = 50;
                        }
                    }
                }

                newCompositions[index] = {
                    id: existingCompo?.id || `pos-${index}`,
                    player_id: draggedPlayer.id,
                    player: draggedPlayer,
                    poste: pos.poste as PosteKey,
                    titulaire: true,
                    minutes: null,
                    x: pos.x,
                    y: pos.y,
                };
                setDraggedPlayer(null);
            }
            // Cas 2: Drop depuis le banc (remplaçant)
            else if (draggedFromBench) {
                // Trouver la position actuelle du joueur sur le banc
                const benchIndex = prev.findIndex((c) => c.player_id === draggedFromBench.player_id);
                if (benchIndex !== -1) {
                    // Si la position cible a déjà un joueur, l'envoyer au banc
                    if (existingCompo && existingCompo.player_id !== 0) {
                        const existingPlayer = teamPlayers.find((p) => p.id === existingCompo.player_id);
                        if (existingPlayer) {
                            const benchCompo = newCompositions[benchIndex];
                            benchCompo.titulaire = false;
                            benchCompo.x = 5;
                            benchCompo.y = 50;
                        }
                    }
                    
                    // Placer le joueur du banc à la nouvelle position
                    newCompositions[index] = {
                        ...draggedFromBench,
                        poste: pos.poste as PosteKey,
                        titulaire: true,
                        x: pos.x,
                        y: pos.y,
                    };
                }
                setDraggedFromBench(null);
            }

            return newCompositions;
        });
    }, [draggedPlayer, draggedFromBench, teamPlayers, selectedFormation]);

    // Gérer le drop d'un joueur sur le banc
    const handleDropOnBench = useCallback((playerId: number) => {
        setCompositions((prev) =>
            prev.map((c) =>
                c.player_id === playerId
                    ? { ...c, titulaire: false, x: 5, y: 50 }
                    : c
            )
        );
    }, []);

    // Changer le poste d'un joueur
    const changePoste = useCallback((playerId: number, newPoste: PosteKey) => {
        setCompositions((prev) =>
            prev.map((c) =>
                c.player_id === playerId ? { ...c, poste: newPoste } : c
            )
        );
    }, []);

    // Retirer un joueur de la composition
    const removePlayer = useCallback((playerId: number) => {
        setCompositions((prev) => {
            const compo = prev.find((c) => c.player_id === playerId);
            if (compo && compo.titulaire) {
                // Réinitialiser la position
                const index = prev.findIndex((c) => c.player_id === playerId);
                const formation = FORMATIONS[selectedFormation];
                const pos = formation.positions[index];
                return prev.map((c) =>
                    c.player_id === playerId
                        ? { ...c, player_id: 0, player: { id: 0, prenom: '', nom: '', numero: '' }, x: pos.x, y: pos.y }
                        : c
                );
            }
            return prev.filter((c) => c.player_id !== playerId);
        });
    }, [selectedFormation]);

    // Sauvegarder
    const handleSave = () => {
        onSave(compositions);
    };

    // Réinitialiser
    const handleReset = () => {
        setCompositions([]);
    };

    // Copier la composition de l'autre équipe (pour test)
    const handleCopyFromOpponent = () => {
        // À implémenter si nécessaire
    };

    return (
        <div className="space-y-4">
            {/* Controls */}
            <div className="flex flex-wrap gap-2 items-center justify-between">
                <div className="flex gap-2">
                    <Select value={selectedFormation} onValueChange={(v) => setSelectedFormation(v as FormationKey)}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Formation" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(FORMATIONS).map(([key, formation]) => (
                                <SelectItem key={key} value={key}>
                                    {formation.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={applyFormation}>
                        Appliquer
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleReset}>
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Reset
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                        <Save className="w-4 h-4 mr-1" />
                        Enregistrer
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b">
                <button
                    onClick={() => setActiveTab('terrain')}
                    className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === 'terrain'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Terrain
                </button>
                <button
                    onClick={() => setActiveTab('liste')}
                    className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === 'liste'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Liste ({titulaires.length}/11)
                </button>
            </div>

            {activeTab === 'terrain' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Terrain */}
                    <div className="lg:col-span-2">
                        <div className="relative aspect-[3/4] bg-gradient-to-b from-green-600 to-green-700 rounded-lg overflow-hidden border-4 border-white">
                            {/* Lignes du terrain */}
                            <div className="absolute inset-4 border-2 border-white/50 rounded" />
                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/50" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-white/50" />
                            
                            {/* Surface de réparation */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-16 border-2 border-white/50 border-t-0" />
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-16 border-2 border-white/50 border-b-0" />

                            {/* Positions des joueurs */}
                            {FORMATIONS[selectedFormation].positions.map((pos, index) => {
                                const compo = compositions[index];
                                const hasPlayer = compo !== undefined && compo.player_id !== 0;

                                return (
                                    <div
                                        key={index}
                                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 flex flex-col items-center justify-center rounded-full border-2 transition-all cursor-pointer
                                            ${hasPlayer
                                                ? teamColor === 'home'
                                                    ? 'bg-blue-500 border-white'
                                                    : 'bg-red-500 border-white'
                                                : 'bg-white/20 border-white/50 border-dashed'
                                            }
                                            hover:scale-110
                                        `}
                                        style={{
                                            left: `${pos.x}%`,
                                            top: `${pos.y}%`,
                                        }}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={() => handleDropOnPosition(index)}
                                    >
                                        {hasPlayer && compo ? (
                                            <>
                                                <span className="text-white text-xs font-bold drop-shadow">
                                                    {compo.player.numero}
                                                </span>
                                                <span className="text-white/90 text-[10px] truncate max-w-[60px] drop-shadow">
                                                    {compo.player.nom}
                                                </span>
                                                <Select
                                                    value={compo.poste}
                                                    onValueChange={(v) => changePoste(compo.player_id, v as PosteKey)}
                                                >
                                                    <SelectTrigger className="h-5 text-[9px] bg-black/30 border-0 text-white mt-0.5">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.values(POSTES).map((poste) => (
                                                            <SelectItem key={poste.value} value={poste.value}>
                                                                {poste.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </>
                                        ) : (
                                            <span className="text-white/50 text-xs">{pos.poste}</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Panel latéral */}
                    <div className="space-y-4">
                        {/* Titulaires */}
                        <Card>
                            <CardHeader className="py-2">
                                <CardTitle className="text-sm flex items-center justify-between">
                                    <span>Titulaires ({titulaires.length}/11)</span>
                                    <Users className="w-4 h-4" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 max-h-48 overflow-y-auto">
                                {titulaires.map((compo) => (
                                    <div
                                        key={compo.id}
                                        draggable
                                        onDragStart={() => setDraggedFromBench(compo)}
                                        className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded cursor-move"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-6 rounded ${POSTES[compo.poste].color}`} />
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {compo.player.prenom} {compo.player.nom}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {POSTES[compo.poste].label} - N°{compo.player.numero}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDropOnBench(compo.player_id)}
                                        >
                                            <span className="text-xs">Banc</span>
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Remplaçants */}
                        <Card
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => {
                                // Drop depuis le terrain vers le banc
                                if (draggedFromBench && draggedFromBench.titulaire) {
                                    handleDropOnBench(draggedFromBench.player_id);
                                    setDraggedFromBench(null);
                                }
                            }}
                        >
                            <CardHeader className="py-2">
                                <CardTitle className="text-sm flex items-center justify-between">
                                    <span>Remplaçants ({remplacants.length})</span>
                                    <Badge variant="outline">Banc</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 max-h-32 overflow-y-auto">
                                {remplacants.map((compo) => (
                                    <div
                                        key={compo.id}
                                        draggable
                                        onDragStart={() => setDraggedFromBench(compo)}
                                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded cursor-move border border-dashed border-gray-300"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-6 rounded ${POSTES[compo.poste].color}`} />
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {compo.player.prenom} {compo.player.nom}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {POSTES[compo.poste].label}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removePlayer(compo.player_id)}
                                        >
                                            <span className="text-xs text-red-500">Retirer</span>
                                        </Button>
                                    </div>
                                ))}
                                {remplacants.length === 0 && (
                                    <p className="text-xs text-gray-500 text-center py-2">
                                        Glissez un joueur ici pour le mettre sur le banc
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Joueurs disponibles */}
                        <Card>
                            <CardHeader className="py-2">
                                <CardTitle className="text-sm">À sélectionner ({nonSelectionnes.length})</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 max-h-32 overflow-y-auto">
                                {nonSelectionnes.map((player) => (
                                    <div
                                        key={player.id}
                                        draggable
                                        onDragStart={() => setDraggedPlayer(player)}
                                        className="flex items-center justify-between p-2 bg-white dark:bg-gray-900 border rounded cursor-move hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        <div>
                                            <p className="text-sm font-medium">
                                                {player.prenom} {player.nom}
                                            </p>
                                            <p className="text-xs text-gray-500">N°{player.numero}</p>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            <Plus className="w-3 h-3 mr-1" />
                                            Glisser
                                        </Badge>
                                    </div>
                                ))}
                                {nonSelectionnes.length === 0 && (
                                    <p className="text-xs text-gray-500 text-center py-2">
                                        Tous les joueurs sont sélectionnés
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : (
                /* Vue en liste */
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {FORMATIONS[selectedFormation].positions.map((pos, index) => {
                            const compo = compositions[index];
                            const hasPlayer = compo !== undefined && compo.player_id !== 0;

                            return (
                                <Card key={index}>
                                    <CardContent className="p-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge className={POSTES[pos.poste].color}>
                                                    {pos.poste}
                                                </Badge>
                                                <span className="text-sm font-medium">
                                                    {hasPlayer && compo
                                                        ? `${compo.player.prenom} ${compo.player.nom} (N°${compo.player.numero})`
                                                        : 'Vacant'
                                                    }
                                                </span>
                                            </div>
                                            {hasPlayer && compo && (
                                                <div className="flex gap-1">
                                                    <Select
                                                        value={compo.poste}
                                                        onValueChange={(v) => changePoste(compo.player_id, v as PosteKey)}
                                                    >
                                                        <SelectTrigger className="h-8 w-32">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Object.values(POSTES).map((poste) => (
                                                                <SelectItem key={poste.value} value={poste.value}>
                                                                    {poste.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removePlayer(compo.player_id)}
                                                    >
                                                        <span className="text-xs">✕</span>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
