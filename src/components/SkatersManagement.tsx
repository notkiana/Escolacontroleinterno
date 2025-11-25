import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ArrowLeft, User, Search, Plus } from 'lucide-react';

interface SkatersManagementProps {
  onBack: () => void;
  onViewProfile: (skaterId: number) => void;
  onCreateSkater: () => void;
}

export function SkatersManagement({ onBack, onViewProfile, onCreateSkater }: SkatersManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [skaters, setSkaters] = useState(() => {
    const saved = localStorage.getItem('skaters');
    return saved ? JSON.parse(saved) : [];
  });

  const filteredSkaters = skaters.filter(skater =>
    skater.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skater.cpf.includes(searchQuery) ||
    skater.phone.includes(searchQuery)
  );

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Iniciante':
        return <Badge className="bg-green-100 text-green-800">{level}</Badge>;
      case 'Intermediário':
        return <Badge className="bg-blue-100 text-blue-800">{level}</Badge>;
      case 'Avançado':
        return <Badge className="bg-purple-100 text-purple-800">{level}</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex-1">
            <h1>Gerenciar Skatistas</h1>
            <p className="text-sm text-muted-foreground">
              Visualize e gerencie os perfis dos seus skatistas
            </p>
          </div>
          <Button onClick={onCreateSkater}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Skatista
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        {/* Barra de pesquisa */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Pesquisar por nome, CPF ou telefone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas rápidas */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-semibold">{skaters.length}</div>
                <div className="text-sm text-muted-foreground">Total Skatistas</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-semibold text-green-600">
                  {skaters.filter(s => s.level === 'Iniciante').length}
                </div>
                <div className="text-sm text-muted-foreground">Iniciantes</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-semibold text-blue-600">
                  {skaters.filter(s => s.level === 'Intermediário').length}
                </div>
                <div className="text-sm text-muted-foreground">Intermediários</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-semibold text-purple-600">
                  {skaters.filter(s => s.level === 'Avançado').length}
                </div>
                <div className="text-sm text-muted-foreground">Avançados</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de skatistas */}
        <div className="grid gap-4">
          {filteredSkaters.map((skater) => (
            <Card key={skater.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={skater.photo} />
                    <AvatarFallback>
                      <User className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium truncate">{skater.name}</h3>
                      {getLevelBadge(skater.level)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>🆔 {skater.cpf}</span>
                      <span>📱 {skater.phone}</span>
                      <span>{skater.gender}</span>
                    </div>
                  </div>

                  <div className="text-center px-4">
                    <div className="text-lg font-semibold text-orange-600">
                      {skater.totalSessions}
                    </div>
                    <div className="text-xs text-muted-foreground">Sessões</div>
                  </div>

                  <div className="text-center px-4">
                    <div className="text-sm">
                      {new Date(skater.lastSession).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="text-xs text-muted-foreground">Última Sessão</div>
                  </div>

                  <Button 
                    variant="outline" 
                    onClick={() => onViewProfile(skater.id)}
                  >
                    Ver Perfil
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSkaters.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">Nenhum skatista encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Tente ajustar os filtros de pesquisa ou adicione um novo skatista.
              </p>
              <Button onClick={onCreateSkater}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Skatista
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}