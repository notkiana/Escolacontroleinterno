import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ArrowLeft, Calendar, Plus, Clock, Users, MapPin, Save, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface SessionsManagementProps {
  onBack: () => void;
  onViewSession: (sessionId: number) => void;
}

export function SessionsManagement({ onBack, onViewSession }: SessionsManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [formData, setFormData] = useState({
    title: '',
    sessionType: 'Treino Técnico',
    location: '',
    maxSkaters: '',
    dateTime: '',
    notes: '',
    level: 'Iniciante'
  });

  // Carregar sessões do localStorage
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.dateTime) {
      toast.error('Preencha título e data/horário');
      return;
    }

    const newSession = {
      id: Date.now(),
      ...formData,
      instructor: 'Bruno Oliveira',
      skaters: 0,
      maxSkaters: parseInt(formData.maxSkaters) || 10
    };

    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    localStorage.setItem('sessions', JSON.stringify(updatedSessions));

    toast.success('Sessão criada com sucesso!');
    setShowForm(false);
    setFormData({
      title: '',
      sessionType: 'Treino Técnico',
      location: '',
      maxSkaters: '',
      dateTime: '',
      notes: '',
      level: 'Iniciante'
    });
  };

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

  const getSessionTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      'Treino Técnico': 'bg-blue-50 text-blue-700 border-blue-200',
      'Treino de Rampa': 'bg-orange-50 text-orange-700 border-orange-200',
      'Treino Street': 'bg-green-50 text-green-700 border-green-200',
      'Avaliação': 'bg-purple-50 text-purple-700 border-purple-200',
      'Competição': 'bg-yellow-50 text-yellow-700 border-yellow-200'
    };
    return <Badge variant="outline" className={colors[type] || ''}>{type}</Badge>;
  };

  // Filtrar sessões por data
  const filteredSessions = filterDate
    ? sessions.filter(session => {
        const sessionDate = new Date(session.dateTime);
        return (
          sessionDate.getDate() === filterDate.getDate() &&
          sessionDate.getMonth() === filterDate.getMonth() &&
          sessionDate.getFullYear() === filterDate.getFullYear()
        );
      })
    : sessions;

  // Obter datas com sessões para destacar no calendário
  const sessionDates = sessions.map(s => new Date(s.dateTime));
  
  const isDayWithSession = (date: Date) => {
    return sessionDates.some(sessionDate => 
      sessionDate.getDate() === date.getDate() &&
      sessionDate.getMonth() === date.getMonth() &&
      sessionDate.getFullYear() === date.getFullYear()
    );
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
            <h1>Todas as Sessões</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie sessões de treino e eventos
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Sessão
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Formulário de Nova Sessão */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Criar Nova Sessão</CardTitle>
              <CardDescription>
                Preencha as informações da sessão de treino
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título da Sessão *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Ex: Treino Iniciante - Manhã"
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="sessionType">Tipo de Treino</Label>
                      <select
                        id="sessionType"
                        value={formData.sessionType}
                        onChange={(e) => setFormData(prev => ({ ...prev, sessionType: e.target.value }))}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-1"
                      >
                        <option>Treino Técnico</option>
                        <option>Treino de Rampa</option>
                        <option>Treino Street</option>
                        <option>Avaliação</option>
                        <option>Competição</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="location">Local</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Ex: Pista Principal, Bowl, Street"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="dateTime">Data e Horário *</Label>
                      <Input
                        id="dateTime"
                        type="datetime-local"
                        value={formData.dateTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, dateTime: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="maxSkaters">Quantidade Máxima de Alunos</Label>
                      <Input
                        id="maxSkaters"
                        type="number"
                        value={formData.maxSkaters}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxSkaters: e.target.value }))}
                        placeholder="Ex: 10"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="level">Nível</Label>
                      <select
                        id="level"
                        value={formData.level}
                        onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-1"
                      >
                        <option>Iniciante</option>
                        <option>Intermediário</option>
                        <option>Avançado</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Informações Adicionais</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Descreva objetivos, foco da sessão ou observações importantes..."
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    Criar Sessão
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de Sessões */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3>Sessões Agendadas</h3>
              {filterDate && (
                <p className="text-sm text-muted-foreground mt-1">
                  Filtrando por: {filterDate.toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrar por Data
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent
                    mode="single"
                    selected={filterDate}
                    onSelect={setFilterDate}
                    modifiers={{
                      hasSession: isDayWithSession
                    }}
                    modifiersClassNames={{
                      hasSession: 'bg-primary/20 font-semibold'
                    }}
                  />
                  <div className="p-3 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setFilterDate(undefined)}
                    >
                      Limpar Filtro
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Badge variant="outline">{filteredSessions.length} sessões</Badge>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle>{session.title}</CardTitle>
                          {getLevelBadge(session.level)}
                          {getSessionTypeBadge(session.sessionType)}
                        </div>
                        <CardDescription className="flex flex-wrap items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(session.dateTime).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(session.dateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {session.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {session.skaters}/{session.maxSkaters} alunos
                          </span>
                        </CardDescription>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onViewSession(session.id)}
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardHeader>
                  {session.notes && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{session.notes}</p>
                    </CardContent>
                  )}
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">Nenhuma sessão encontrada</h3>
                  <p className="text-muted-foreground mb-4">
                    {filterDate 
                      ? 'Não há sessões agendadas para esta data. Tente selecionar outra data ou crie uma nova sessão.'
                      : 'Comece criando sua primeira sessão de treino.'}
                  </p>
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Sessão
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}