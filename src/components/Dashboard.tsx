import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Users, Clock, User } from 'lucide-react';

interface DashboardProps {
  onNavigateToSkaters: () => void;
  onNavigateToProfile: (skaterId: number) => void;
  onNavigateToSessions: () => void;
  onNavigateToSessionDetails: (sessionId: number) => void;
  onNavigateToInstructorProfile?: () => void;
  onLogout: () => void;
}

export function Dashboard({ onNavigateToSkaters, onNavigateToProfile, onNavigateToSessions, onNavigateToSessionDetails, onNavigateToInstructorProfile, onLogout }: DashboardProps) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [skaters, setSkaters] = useState<any[]>([]);
  const [totalHoursThisMonth, setTotalHoursThisMonth] = useState(0);
  const [newSkatersThisMonth, setNewSkatersThisMonth] = useState(0);

  useEffect(() => {
    // Carregar sessões do localStorage
    const savedSessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    setSessions(savedSessions.slice(0, 3)); // Mostrar apenas as 3 primeiras

    // Carregar skatistas do localStorage
    const savedSkaters = JSON.parse(localStorage.getItem('skaters') || '[]');
    setSkaters(savedSkaters.slice(0, 4)); // Mostrar apenas os 4 primeiros

    // Calcular horas do mês (total de presenças no último mês)
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    let totalPresences = 0;

    savedSessions.forEach((session: any) => {
      const sessionDate = new Date(session.dateTime);
      if (sessionDate >= firstDayOfMonth && sessionDate <= now) {
        const attendance = JSON.parse(localStorage.getItem(`session_${session.id}_attendance`) || '[]');
        const presentCount = attendance.filter((a: any) => a.present).length;
        totalPresences += presentCount;
      }
    });

    setTotalHoursThisMonth(totalPresences);

    // Calcular novos skatistas no último mês
    const newSkaters = savedSkaters.filter((skater: any) => {
      if (skater.createdAt) {
        const createdDate = new Date(skater.createdAt);
        return createdDate >= firstDayOfMonth && createdDate <= now;
      }
      return false;
    });

    setNewSkatersThisMonth(newSkaters.length);
  }, []);

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
            <Button variant="outline" onClick={onNavigateToSessions}>
              <Calendar className="w-4 h-4 mr-2" />
              Todas as Sessões
            </Button>
            <Button variant="outline" onClick={onNavigateToSkaters}>
              <Users className="w-4 h-4 mr-2" />
              Gerenciar Skatistas
            </Button>
            {onNavigateToInstructorProfile && (
              <Button variant="outline" onClick={onNavigateToInstructorProfile}>
                Perfil do Instrutor
              </Button>
            )}
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
                <div className="text-2xl font-semibold">
                  {JSON.parse(localStorage.getItem('skaters') || '[]').length}
                </div>
                <div className="text-sm text-muted-foreground">Skatistas Ativos</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Calendar className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <div className="text-2xl font-semibold">
                  {JSON.parse(localStorage.getItem('sessions') || '[]').length}
                </div>
                <div className="text-sm text-muted-foreground">Sessões Agendadas</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="w-8 h-8 mx-auto text-orange-600 mb-2" />
                <div className="text-2xl font-semibold">{totalHoursThisMonth}</div>
                <div className="text-sm text-muted-foreground">Horas Este Mês</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <User className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <div className="text-2xl font-semibold">{newSkatersThisMonth}</div>
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
              <Badge variant="outline">{sessions.length} sessões</Badge>
            </div>
            
            <div className="space-y-3">
              {sessions.length > 0 ? (
                sessions.map((session) => (
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
                          {new Date(session.dateTime || session.time).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onNavigateToSessionDetails(session.id)}
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center py-8">
                    <Calendar className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                    <h3 className="font-medium mb-2">Nenhuma sessão agendada</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Crie sua primeira sessão de treino para começar.
                    </p>
                    <Button size="sm" onClick={onNavigateToSessions}>
                      Criar Sessão
                    </Button>
                  </CardContent>
                </Card>
              )}
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
                {skaters.length > 0 ? (
                  <div className="space-y-4">
                    {skaters.map((skater) => (
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
                              {skater.totalSessions || 0} sessões no total
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
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                    <h3 className="font-medium mb-2">Nenhum skatista cadastrado</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Adicione seu primeiro skatista para começar.
                    </p>
                    <Button size="sm" onClick={onNavigateToSkaters}>
                      Adicionar Skatista
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}