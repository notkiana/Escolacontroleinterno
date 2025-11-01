import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Users, Clock, User } from 'lucide-react';

interface DashboardProps {
  onNavigateToSkaters: () => void;
  onNavigateToProfile: (skaterId: number) => void;
  onLogout: () => void;
}

export function Dashboard({ onNavigateToSkaters, onNavigateToProfile, onLogout }: DashboardProps) {
  const mockSessions = [
    {
      id: 1,
      title: 'Treino Iniciante - Manhã',
      instructor: 'Bruno Oliveira',
      skaters: 8,
      time: '2025-10-15 09:00',
      location: 'Pista Principal',
      level: 'Iniciante'
    },
    {
      id: 2,
      title: 'Treino Intermediário',
      instructor: 'Bruno Oliveira',
      skaters: 6,
      time: '2025-10-15 14:00',
      location: 'Bowl',
      level: 'Intermediário'
    },
    {
      id: 3,
      title: 'Treino Avançado',
      instructor: 'Bruno Oliveira',
      skaters: 4,
      time: '2025-10-15 16:00',
      location: 'Street',
      level: 'Avançado'
    }
  ];

  const recentSkaters = [
    {
      id: 1,
      name: 'João Silva',
      lastSession: '2025-10-14',
      level: 'Intermediário',
      sessionsThisMonth: 8
    },
    {
      id: 2,
      name: 'Maria Santos',
      lastSession: '2025-10-14',
      level: 'Iniciante',
      sessionsThisMonth: 12
    },
    {
      id: 3,
      name: 'Pedro Oliveira',
      lastSession: '2025-10-13',
      level: 'Avançado',
      sessionsThisMonth: 10
    },
    {
      id: 4,
      name: 'Ana Costa',
      lastSession: '2025-10-14',
      level: 'Iniciante',
      sessionsThisMonth: 6
    }
  ];

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
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-lg">🛹</span>
            </div>
            <div>
              <h1>SkateFlow Pro</h1>
              <p className="text-sm text-muted-foreground">
                Portal do Instrutor
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onNavigateToSkaters}>
              <Users className="w-4 h-4 mr-2" />
              Gerenciar Skatistas
            </Button>
            <Button variant="outline" onClick={onLogout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <div className="mb-6">
          <h2>Bem-vindo, Bruno Oliveira!</h2>
          <p className="text-muted-foreground">
            Gerencie seus skatistas e acompanhe as sessões de treino.
          </p>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto text-primary mb-2" />
                <div className="text-2xl font-semibold">24</div>
                <div className="text-sm text-muted-foreground">Skatistas Ativos</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Calendar className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <div className="text-2xl font-semibold">3</div>
                <div className="text-sm text-muted-foreground">Sessões Hoje</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="w-8 h-8 mx-auto text-orange-600 mb-2" />
                <div className="text-2xl font-semibold">156</div>
                <div className="text-sm text-muted-foreground">Horas Este Mês</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <span className="text-3xl">🏆</span>
                <div className="text-2xl font-semibold">12</div>
                <div className="text-sm text-muted-foreground">Novos Skatistas</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Sessões de Hoje */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3>Sessões de Hoje</h3>
              <Badge variant="outline">{mockSessions.length} sessões</Badge>
            </div>
            
            <div className="space-y-3">
              {mockSessions.map((session) => (
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {session.title}
                        </CardTitle>
                        <CardDescription>
                          {session.location} • {session.skaters} skatistas
                        </CardDescription>
                      </div>
                      {getLevelBadge(session.level)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {new Date(session.time).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Skatistas Recentes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3>Skatistas Recentes</h3>
              <Button variant="outline" size="sm" onClick={onNavigateToSkaters}>
                Ver Todos
              </Button>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {recentSkaters.map((skater) => (
                    <div key={skater.id} className="flex items-center justify-between pb-4 last:pb-0 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span>{skater.name}</span>
                            {getLevelBadge(skater.level)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {skater.sessionsThisMonth} sessões este mês
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onNavigateToProfile(skater.id)}
                      >
                        Ver Perfil
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
