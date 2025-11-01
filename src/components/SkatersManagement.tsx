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
}

export function SkatersManagement({ onBack, onViewProfile }: SkatersManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const mockSkaters = [
    {
      id: 1,
      name: 'João Silva',
      cpf: '123.456.789-00',
      gender: 'Masculino',
      school: 'Colégio São Paulo',
      level: 'Intermediário',
      lastSession: '2025-10-14',
      totalSessions: 45
    },
    {
      id: 2,
      name: 'Maria Santos',
      cpf: '234.567.890-11',
      gender: 'Feminino',
      school: 'Escola Municipal Centro',
      level: 'Iniciante',
      lastSession: '2025-10-14',
      totalSessions: 28
    },
    {
      id: 3,
      name: 'Pedro Oliveira',
      cpf: '345.678.901-22',
      gender: 'Masculino',
      school: 'Instituto Educacional Norte',
      level: 'Avançado',
      lastSession: '2025-10-13',
      totalSessions: 82
    },
    {
      id: 4,
      name: 'Ana Costa',
      cpf: '456.789.012-33',
      gender: 'Feminino',
      school: 'Colégio Estadual Sul',
      level: 'Iniciante',
      lastSession: '2025-10-14',
      totalSessions: 15
    },
    {
      id: 5,
      name: 'Carlos Mendes',
      cpf: '567.890.123-44',
      gender: 'Masculino',
      school: 'Escola Técnica Leste',
      level: 'Intermediário',
      lastSession: '2025-10-12',
      totalSessions: 56
    },
    {
      id: 6,
      name: 'Lucia Ferreira',
      cpf: '678.901.234-55',
      gender: 'Feminino',
      school: 'Colégio Particular Oeste',
      level: 'Avançado',
      lastSession: '2025-10-14',
      totalSessions: 98
    }
  ];

  const filteredSkaters = mockSkaters.filter(skater =>
    skater.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skater.cpf.includes(searchQuery) ||
    skater.school.toLowerCase().includes(searchQuery.toLowerCase())
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
          <Button>
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
                placeholder="Pesquisar por nome, CPF ou escola..."
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
                <div className="text-2xl font-semibold">{mockSkaters.length}</div>
                <div className="text-sm text-muted-foreground">Total Skatistas</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-semibold text-green-600">
                  {mockSkaters.filter(s => s.level === 'Iniciante').length}
                </div>
                <div className="text-sm text-muted-foreground">Iniciantes</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-semibold text-blue-600">
                  {mockSkaters.filter(s => s.level === 'Intermediário').length}
                </div>
                <div className="text-sm text-muted-foreground">Intermediários</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-semibold text-purple-600">
                  {mockSkaters.filter(s => s.level === 'Avançado').length}
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
                    <AvatarImage src="" />
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
                      <span>🏫 {skater.school}</span>
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
              <Button>
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
