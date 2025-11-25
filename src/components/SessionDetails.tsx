import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Calendar, Clock, Users, MapPin, Edit, Plus, User, Check, X, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

interface SessionDetailsProps {
  sessionId: number;
  onBack: () => void;
}

interface Skater {
  id: number;
  name: string;
  level: string;
  photo?: string;
}

interface SessionAttendance {
  skaterId: number;
  present: boolean;
  date: string;
}

export function SessionDetails({ sessionId, onBack }: SessionDetailsProps) {
  const [session, setSession] = useState<any>(null);
  const [enrolledSkaters, setEnrolledSkaters] = useState<number[]>([]);
  const [attendance, setAttendance] = useState<SessionAttendance[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [availableSkaters, setAvailableSkaters] = useState<Skater[]>([]);
  const [selectedSkaters, setSelectedSkaters] = useState<number[]>([]);

  useEffect(() => {
    // Carregar dados da sessão do localStorage
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const foundSession = sessions.find((s: any) => s.id === sessionId);
    setSession(foundSession);

    // Carregar alunos inscritos
    const enrolled = JSON.parse(localStorage.getItem(`session_${sessionId}_skaters`) || '[]');
    setEnrolledSkaters(enrolled);

    // Carregar controle de presença
    const savedAttendance = JSON.parse(localStorage.getItem(`session_${sessionId}_attendance`) || '[]');
    setAttendance(savedAttendance);

    // Carregar todos os skatistas disponíveis
    const allSkaters = JSON.parse(localStorage.getItem('skaters') || '[]');
    setAvailableSkaters(allSkaters);
  }, [sessionId]);

  const handleAddSkaters = () => {
    if (selectedSkaters.length === 0) {
      toast.error('Selecione pelo menos um aluno');
      return;
    }

    const updatedEnrolled = [...new Set([...enrolledSkaters, ...selectedSkaters])];
    setEnrolledSkaters(updatedEnrolled);
    localStorage.setItem(`session_${sessionId}_skaters`, JSON.stringify(updatedEnrolled));

    // Atualizar contagem na sessão
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const updatedSessions = sessions.map((s: any) =>
      s.id === sessionId ? { ...s, skaters: updatedEnrolled.length } : s
    );
    localStorage.setItem('sessions', JSON.stringify(updatedSessions));
    setSession({ ...session, skaters: updatedEnrolled.length });

    // Inicializar presença para novos alunos
    const newAttendance = selectedSkaters.map(skaterId => ({
      skaterId,
      present: false,
      date: new Date().toISOString().split('T')[0]
    }));
    const updatedAttendance = [...attendance, ...newAttendance];
    setAttendance(updatedAttendance);
    localStorage.setItem(`session_${sessionId}_attendance`, JSON.stringify(updatedAttendance));

    toast.success(`${selectedSkaters.length} aluno(s) adicionado(s) à sessão`);
    setSelectedSkaters([]);
    setShowAddDialog(false);
  };

  const handleRemoveSkater = (skaterId: number) => {
    const updatedEnrolled = enrolledSkaters.filter(id => id !== skaterId);
    setEnrolledSkaters(updatedEnrolled);
    localStorage.setItem(`session_${sessionId}_skaters`, JSON.stringify(updatedEnrolled));

    // Atualizar contagem na sessão
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const updatedSessions = sessions.map((s: any) =>
      s.id === sessionId ? { ...s, skaters: updatedEnrolled.length } : s
    );
    localStorage.setItem('sessions', JSON.stringify(updatedSessions));
    setSession({ ...session, skaters: updatedEnrolled.length });

    // Remover da presença
    const updatedAttendance = attendance.filter(a => a.skaterId !== skaterId);
    setAttendance(updatedAttendance);
    localStorage.setItem(`session_${sessionId}_attendance`, JSON.stringify(updatedAttendance));

    toast.success('Aluno removido da sessão');
  };

  const toggleAttendance = (skaterId: number) => {
    const updatedAttendance = attendance.map(a =>
      a.skaterId === skaterId ? { ...a, present: !a.present } : a
    );
    setAttendance(updatedAttendance);
    localStorage.setItem(`session_${sessionId}_attendance`, JSON.stringify(updatedAttendance));
  };

  const toggleSkaterSelection = (skaterId: number) => {
    setSelectedSkaters(prev =>
      prev.includes(skaterId)
        ? prev.filter(id => id !== skaterId)
        : [...prev, skaterId]
    );
  };

  const getEnrolledSkaterDetails = () => {
    return enrolledSkaters.map(id => {
      const skater = availableSkaters.find(s => s.id === id);
      const attendanceRecord = attendance.find(a => a.skaterId === id);
      return {
        ...skater,
        present: attendanceRecord?.present || false
      };
    }).filter(s => s.id);
  };

  const getAbsentSkaters = () => {
    return getEnrolledSkaterDetails().filter(s => !s.present);
  };

  const getPresentSkaters = () => {
    return getEnrolledSkaterDetails().filter(s => s.present);
  };

  const unenrolledSkaters = availableSkaters.filter(s => !enrolledSkaters.includes(s.id));

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Sessão não encontrada</p>
      </div>
    );
  }

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

  const enrolledDetails = getEnrolledSkaterDetails();
  const presentCount = getPresentSkaters().length;
  const absentCount = getAbsentSkaters().length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex-1">
            <h1>Detalhes da Sessão</h1>
            <p className="text-sm text-muted-foreground">
              Informações completas da sessão de treino
            </p>
          </div>
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Editar Sessão
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Informações Principais */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-2xl">{session.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {getLevelBadge(session.level)}
                  {getSessionTypeBadge(session.sessionType)}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Grid de Informações */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Data</span>
                </div>
                <p className="font-medium">
                  {new Date(session.dateTime).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Horário</span>
                </div>
                <p className="font-medium">
                  {new Date(session.dateTime).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Local</span>
                </div>
                <p className="font-medium">{session.location}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Alunos</span>
                </div>
                <p className="font-medium">
                  {enrolledSkaters.length} / {session.maxSkaters}
                </p>
              </div>
            </div>

            {/* Instrutor */}
            <div className="border-t pt-4">
              <h3 className="mb-2">Instrutor Responsável</h3>
              <p className="text-muted-foreground">{session.instructor}</p>
            </div>

            {/* Observações */}
            {session.notes && (
              <div className="border-t pt-4">
                <h3 className="mb-2">Informações Adicionais</h3>
                <p className="text-muted-foreground leading-relaxed">{session.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs de Alunos e Presença */}
        <Tabs defaultValue="students" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="students">
              Alunos Inscritos ({enrolledSkaters.length})
            </TabsTrigger>
            <TabsTrigger value="attendance">
              Controle de Presença
            </TabsTrigger>
          </TabsList>

          {/* Aba de Alunos Inscritos */}
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Alunos Inscritos</CardTitle>
                    <CardDescription>
                      {enrolledSkaters.length} aluno(s) confirmado(s)
                    </CardDescription>
                  </div>
                  <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Alunos
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[600px] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Adicionar Alunos à Sessão</DialogTitle>
                        <DialogDescription>
                          Selecione os alunos que participarão desta sessão
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 mt-4">
                        {unenrolledSkaters.length === 0 ? (
                          <p className="text-center text-muted-foreground py-8">
                            Todos os alunos já estão inscritos nesta sessão
                          </p>
                        ) : (
                          <>
                            <div className="space-y-2">
                              {unenrolledSkaters.map(skater => (
                                <div
                                  key={skater.id}
                                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                  onClick={() => toggleSkaterSelection(skater.id)}
                                >
                                  <Checkbox
                                    checked={selectedSkaters.includes(skater.id)}
                                    onCheckedChange={() => toggleSkaterSelection(skater.id)}
                                  />
                                  <Avatar className="w-10 h-10">
                                    <AvatarImage src={skater.photo} />
                                    <AvatarFallback>
                                      <User className="w-5 h-5" />
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <p className="font-medium">{skater.name}</p>
                                    <p className="text-sm text-muted-foreground">{skater.level}</p>
                                  </div>
                                  {getLevelBadge(skater.level)}
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex justify-end gap-2 pt-4 border-t">
                              <Button variant="outline" onClick={() => {
                                setShowAddDialog(false);
                                setSelectedSkaters([]);
                              }}>
                                Cancelar
                              </Button>
                              <Button onClick={handleAddSkaters}>
                                Adicionar {selectedSkaters.length > 0 && `(${selectedSkaters.length})`}
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {enrolledDetails.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">Nenhum aluno inscrito</h3>
                    <p className="text-muted-foreground mb-4">
                      Adicione alunos para esta sessão de treino.
                    </p>
                    <Button onClick={() => setShowAddDialog(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Alunos
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {enrolledDetails.map((skater: any) => (
                      <div
                        key={skater.id}
                        className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={skater.photo} />
                          <AvatarFallback>
                            <User className="w-6 h-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{skater.name}</p>
                          <p className="text-sm text-muted-foreground">{skater.level}</p>
                        </div>
                        {skater.present ? (
                          <Badge className="bg-green-100 text-green-800">
                            <Check className="w-3 h-3 mr-1" />
                            Presente
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-orange-600 border-orange-300">
                            Pendente
                          </Badge>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveSkater(skater.id)}
                        >
                          Remover
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Controle de Presença */}
          <TabsContent value="attendance">
            <div className="space-y-4">
              {/* Estatísticas de Presença */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-semibold">{enrolledSkaters.length}</div>
                      <p className="text-sm text-muted-foreground">Total de Alunos</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Check className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-semibold text-green-600">{presentCount}</div>
                      <p className="text-sm text-muted-foreground">Presentes</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <X className="w-8 h-8 mx-auto mb-2 text-red-600" />
                      <div className="text-2xl font-semibold text-red-600">{absentCount}</div>
                      <p className="text-sm text-muted-foreground">Ausentes</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Lista de Presença */}
              <Card>
                <CardHeader>
                  <CardTitle>Marcar Presença</CardTitle>
                  <CardDescription>
                    Clique nos alunos para marcar presença na sessão
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {enrolledDetails.length === 0 ? (
                    <div className="text-center py-12">
                      <UserCheck className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-medium mb-2">Nenhum aluno inscrito</h3>
                      <p className="text-muted-foreground">
                        Adicione alunos à sessão para controlar a presença.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {enrolledDetails.map((skater: any) => (
                        <div
                          key={skater.id}
                          className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                            skater.present
                              ? 'bg-green-50 border-green-200'
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => toggleAttendance(skater.id)}
                        >
                          <Checkbox
                            checked={skater.present}
                            onCheckedChange={() => toggleAttendance(skater.id)}
                          />
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={skater.photo} />
                            <AvatarFallback>
                              <User className="w-6 h-6" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{skater.name}</p>
                            <p className="text-sm text-muted-foreground">{skater.level}</p>
                          </div>
                          {skater.present ? (
                            <Badge className="bg-green-100 text-green-800">
                              <Check className="w-3 h-3 mr-1" />
                              Presente
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-red-600 border-red-300">
                              <X className="w-3 h-3 mr-1" />
                              Ausente
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Alunos Ausentes */}
              {absentCount > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Alunos Ausentes</CardTitle>
                    <CardDescription>
                      {absentCount} aluno(s) faltou(faltaram) nesta sessão
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {getAbsentSkaters().map((skater: any) => (
                        <div
                          key={skater.id}
                          className="flex items-center gap-3 p-3 border border-red-200 rounded-lg bg-red-50"
                        >
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={skater.photo} />
                            <AvatarFallback>
                              <User className="w-5 h-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{skater.name}</p>
                            <p className="text-sm text-muted-foreground">{skater.level}</p>
                          </div>
                          <Badge variant="outline" className="text-red-600 border-red-300">
                            <X className="w-3 h-3 mr-1" />
                            Falta
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
