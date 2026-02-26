import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import * as matchService from '@/api/matchService';
import * as adminService from '@/api/adminService';

const TeamManagement = ({ adminId }) => {
  const [teams, setTeams] = useState([]);
  const [editingTeam, setEditingTeam] = useState(null);
  const [formData, setFormData] = useState({ name: '', logo_url: '', players_json: [] });
  const [newPlayer, setNewPlayer] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = () => {
    const data = matchService.getTeams();
    setTeams(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Nom requis",
        description: "Veuillez entrer le nom de l'équipe",
        variant: "destructive"
      });
      return;
    }

    if (editingTeam) {
      matchService.updateTeam(editingTeam.id, formData);
      adminService.logAuditAction(adminId, 'UPDATE_TEAM', { teamId: editingTeam.id, name: formData.name });
      toast({
        title: "Équipe mise à jour",
        description: `${formData.name} a été modifiée avec succès`,
      });
    } else {
      const newTeam = matchService.addTeam({
        ...formData,
        logo_url: formData.logo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}&backgroundColor=1E40AF&textColor=ffffff`
      });
      adminService.logAuditAction(adminId, 'ADD_TEAM', { teamId: newTeam.id, name: formData.name });
      toast({
        title: "Équipe ajoutée",
        description: `${formData.name} a été créée avec succès`,
      });
    }

    setFormData({ name: '', logo_url: '', players_json: [] });
    setEditingTeam(null);
    loadTeams();
  };

  const handleEdit = (team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      logo_url: team.logo_url,
      players_json: team.players_json || []
    });
  };

  const handleAddPlayer = () => {
    if (newPlayer.trim()) {
      setFormData({
        ...formData,
        players_json: [...(formData.players_json || []), newPlayer.trim()]
      });
      setNewPlayer('');
    }
  };

  const handleRemovePlayer = (index) => {
    const updatedPlayers = formData.players_json.filter((_, i) => i !== index);
    setFormData({ ...formData, players_json: updatedPlayers });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">
          {editingTeam ? 'Modifier l\'équipe' : 'Ajouter une équipe'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Nom de l'équipe</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white text-gray-900 px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 focus:outline-none transition-all"
              placeholder="Ex: GALACTIQUE FA"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">URL du logo</label>
            <input
              type="text"
              value={formData.logo_url}
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
              className="w-full bg-white text-gray-900 px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 focus:outline-none transition-all"
              placeholder="https://..."
            />
            <p className="text-gray-500 text-sm mt-1">
              Laisser vide pour générer un avatar par défaut
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Effectif (Joueurs)</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newPlayer}
                onChange={(e) => setNewPlayer(e.target.value)}
                className="flex-1 bg-white text-gray-900 px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 focus:outline-none"
                placeholder="Nom du joueur"
              />
              <Button
                type="button"
                onClick={handleAddPlayer}
                className="bg-primary-blue hover:bg-blue-800 text-white"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto space-y-2 border border-gray-200">
              {(formData.players_json || []).length === 0 && (
                <p className="text-gray-400 text-sm text-center italic">Aucun joueur ajouté</p>
              )}
              {(formData.players_json || []).map((player, index) => (
                <div key={index} className="flex items-center justify-between bg-white px-4 py-2 rounded border border-gray-200 shadow-sm">
                  <span className="text-gray-800 text-sm font-medium">{player}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePlayer(index)}
                    className="text-accent-red hover:text-red-700 text-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="bg-primary-blue hover:bg-blue-800 text-white flex-1 py-6 text-lg">
              {editingTeam ? 'Mettre à jour' : 'Ajouter'} l'équipe
            </Button>
            {editingTeam && (
              <Button
                type="button"
                onClick={() => {
                  setEditingTeam(null);
                  setFormData({ name: '', logo_url: '', players_json: [] });
                }}
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-100 py-6"
              >
                Annuler
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          Équipes existantes 
          <span className="bg-primary-blue text-white text-xs px-2 py-1 rounded-full">{teams.length}</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map(team => (
            <div key={team.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-primary-blue transition-all group">
              <div className="w-16 h-16 bg-white rounded-full p-2 border border-gray-200 shadow-sm group-hover:shadow-md transition-all">
                <img 
                  src={team.logo_url} 
                  alt={team.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-gray-900 font-bold truncate">{team.name}</div>
                <div className="text-gray-500 text-sm">
                  {team.players_json?.length || 0} joueur(s)
                </div>
              </div>
              <Button
                onClick={() => handleEdit(team)}
                variant="outline"
                size="sm"
                className="border-primary-blue text-primary-blue hover:bg-blue-50"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;