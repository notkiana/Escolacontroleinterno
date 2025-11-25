import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, User, FileText, Calendar, Plus, Save, UserCheck, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface SkaterProfileProps {
  skaterId: number;
  onBack: () => void;
}

export function SkaterProfile({ skaterId, onBack }: SkaterProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  
  const [skater, setSkater] = useState(() => {
    const skaters = JSON.parse(localStorage.getItem('skaters') || '[]');
    const found = skaters.find((s: any) => s.id === skaterId);
    return found || {
      id: skaterId,
      name: 'João Silva',
      cpf: '123.456.789-00',
      cep: '01310-100',
      gender: 'Masculino',
      phone: '(11) 98765-4321',
      motherName: 'Maria Silva',
      fatherName: 'José Silva',
      susCard: '123 4567 8901 2345',
      photo: '',
      level: 'Intermediário',
      enrollmentDate: '2024-03-15',
      totalSessions: 45
    };
  });

  const [formData, setFormData] = useState(skater);

  const [attendanceHistory, setAttendanceHistory] = useState(() => {
    // Buscar todas as sessões onde o skatista está inscrito
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const history: any[] = [];
    
    sessions.forEach((session: any) => {
      const enrolledSkaters = JSON.parse(localStorage.getItem(`session_${session.id}_skaters`) || '[]');
      if (enrolledSkaters.includes(skaterId)) {
        const attendance = JSON.parse(localStorage.getItem(`session_${session.id}_attendance`) || '[]');
        const skaterAttendance = attendance.find((a: any) => a.skaterId === skaterId);
        
        history.push({
          sessionId: session.id,
          sessionTitle: session.title,
          sessionType: session.sessionType,
          date: new Date(session.dateTime).toLocaleDateString('pt-BR'),
          dateTime: session.dateTime,
          present: skaterAttendance?.present || false
        });
      }
    });
    
    // Ordenar por data (mais recente primeiro)
    return history.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem(`notes_${skaterId}`);
    return saved ? JSON.parse(saved) : [
    {
      id: 1,
      date: '2025-10-14',
      title: 'Sessão de Ollie',
      content: 'João mostrou grande evolução no ollie. Conseguiu executar a manobra com consistência em movimento. Trabalhar agora na altura do ollie e transição para kickflip.',
      instructor: 'Bruno Oliveira',
      sessionType: 'Treino Técnico'
    },
    {
      id: 2,
      date: '2025-10-10',
      title: 'Progresso em Manobras de Rampa',
      content: 'Primeira tentativa bem-sucedida de drop in na mini ramp. Mostrou confiança e boa postura. Próxima etapa: trabalhar kickturns e transições.',
      instructor: 'Bruno Oliveira',
      sessionType: 'Treino de Rampa'
    },
    {
      id: 3,
      date: '2025-10-05',
      title: 'Avaliação Mensal',
      content: 'Skatista demonstra dedicação e evolução constante. Frequência regular nas aulas (4x por semana). Pontos fortes: equilíbrio e determinação. Áreas de melhoria: confiança em manobras mais avançadas. Recomendação: continuar com treinos regulares e incluir sessões de bowl.',
      instructor: 'Bruno Oliveira',
      sessionType: 'Avaliação'
    },
    {
      id: 4,
      date: '2025-09-28',
      title: 'Participação em Evento',
      content: 'João participou do campeonato amador local. Executou sua run com segurança, incluindo ollies, manuals e tentativa de kickflip. Classificou-se em 5º lugar na categoria iniciante-intermediário. Comportamento exemplar e espírito esportivo.',
      instructor: 'Bruno Oliveira',
      sessionType: 'Competição'
    }
  ];
  });

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
    switch (type) {
      case 'Treino Técnico':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{type}</Badge>;
      case 'Treino de Rampa':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">{type}</Badge>;
      case 'Avaliação':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">{type}</Badge>;
      case 'Competição':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">{type}</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const handleSaveNote = () => {
    if (!newNoteTitle.trim() || !newNote.trim()) {
      toast.error('Preencha título e conteúdo da anotação');
      return;
    }

    const newNoteObj = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      title: newNoteTitle,
      content: newNote,
      instructor: 'Bruno Oliveira',
      sessionType: 'Treino Técnico'
    };
    
    const updatedNotes = [newNoteObj, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem(`notes_${skaterId}`, JSON.stringify(updatedNotes));
    
    toast.success('Anotação salva com sucesso!');
    setNewNote('');
    setNewNoteTitle('');
  };

  const handleSaveProfile = () => {
    const skaters = JSON.parse(localStorage.getItem('skaters') || '[]');
    const updatedSkaters = skaters.map((s: any) => 
      s.id === skaterId ? { ...s, ...formData } : s
    );
    localStorage.setItem('skaters', JSON.stringify(updatedSkaters));
    setSkater(formData);
    setIsEditing(false);
    toast.success('Perfil atualizado com sucesso!');
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
            <h1>Perfil do Skatista</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie informações e relatórios de aulas
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancelar' : 'Editar Perfil'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Informações Básicas
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Anotações e Relatórios
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Histórico de Presença
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={skater.photo} />
                    <AvatarFallback>
                      <User className="w-8 h-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {skater.name}
                      {getLevelBadge(skater.level)}
                    </CardTitle>
                    <CardDescription>
                      Skatista desde {new Date(skater.enrollmentDate).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-semibold text-orange-600">{skater.totalSessions}</div>
                    <div className="text-sm text-muted-foreground">Sessões Totais</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        value={formData.cpf}
                        onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cep">CEP</Label>
                      <Input
                        id="cep"
                        value={formData.cep}
                        onChange={(e) => setFormData(prev => ({ ...prev, cep: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gênero</Label>
                      <Input
                        id="gender"
                        value={formData.gender}
                        onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="motherName">Nome da Mãe</Label>
                      <Input
                        id="motherName"
                        value={formData.motherName}
                        onChange={(e) => setFormData(prev => ({ ...prev, motherName: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fatherName">Nome do Pai</Label>
                      <Input
                        id="fatherName"
                        value={formData.fatherName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fatherName: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="susCard">Carteirinha do SUS</Label>
                      <Input
                        id="susCard"
                        value={formData.susCard}
                        onChange={(e) => setFormData(prev => ({ ...prev, susCard: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="level">Nível</Label>
                      <select
                        id="level"
                        value={formData.level}
                        onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                        disabled={!isEditing}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-1 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option>Iniciante</option>
                        <option>Intermediário</option>
                        <option>Avançado</option>
                      </select>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => {
                      setIsEditing(false);
                      setFormData(skater);
                    }}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveProfile}>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Alterações
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <div className="space-y-6">
              {/* Adicionar Nova Anotação */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Nova Anotação
                  </CardTitle>
                  <CardDescription>
                    Registre observações sobre a aula ou progresso do skatista
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="newNoteTitle">Título da Anotação</Label>
                    <Input
                      id="newNoteTitle"
                      placeholder="Ex: Progresso em Ollies, Avaliação Semanal, etc."
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newNote">Conteúdo da Anotação</Label>
                    <Textarea
                      id="newNote"
                      placeholder="Descreva o desempenho, progressos, dificuldades ou observações relevantes da sessão de treino..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="mt-2 min-h-[120px]"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSaveNote} disabled={!newNote.trim() || !newNoteTitle.trim()}>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Anotação
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Histórico de Anotações */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3>Histórico de Anotações</h3>
                  <Badge variant="outline">{notes.length} registros</Badge>
                </div>

                <div className="space-y-4">
                  {notes.map((note) => (
                    <Card key={note.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle>{note.title}</CardTitle>
                              {getSessionTypeBadge(note.sessionType)}
                            </div>
                            <CardDescription className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(note.date).toLocaleDateString('pt-BR')}
                              </span>
                              <span>Instrutor: {note.instructor}</span>
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed">{note.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {notes.length === 0 && (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">Nenhuma anotação registrada</h3>
                    <p className="text-muted-foreground mb-4">
                      Adicione anotações sobre as aulas e progresso do skatista acima.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="attendance">
            <div className="space-y-6">
              {/* Estatísticas de Presença */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-semibold">{attendanceHistory.length}</div>
                      <p className="text-sm text-muted-foreground">Total de Sessões</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Check className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-semibold text-green-600">
                        {attendanceHistory.filter(a => a.present).length}
                      </div>
                      <p className="text-sm text-muted-foreground">Presenças</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <X className="w-8 h-8 mx-auto mb-2 text-red-600" />
                      <div className="text-2xl font-semibold text-red-600">
                        {attendanceHistory.filter(a => !a.present).length}
                      </div>
                      <p className="text-sm text-muted-foreground">Faltas</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Histórico de Presença */}
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Presença</CardTitle>
                  <CardDescription>
                    Registro completo de participação nas sessões
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {attendanceHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <UserCheck className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-medium mb-2">Nenhuma sessão registrada</h3>
                      <p className="text-muted-foreground">
                        O skatista ainda não foi inscrito em nenhuma sessão.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {attendanceHistory.map((record, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-4 border rounded-lg ${
                            record.present
                              ? 'bg-green-50 border-green-200'
                              : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {record.present ? (
                              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <Check className="w-5 h-5 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <X className="w-5 h-5 text-red-600" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{record.sessionTitle}</p>
                              <p className="text-sm text-muted-foreground">
                                {record.date} - {record.sessionType}
                              </p>
                            </div>
                          </div>
                          {record.present ? (
                            <Badge className="bg-green-100 text-green-800">
                              <Check className="w-3 h-3 mr-1" />
                              Presente
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-red-600 border-red-300">
                              <X className="w-3 h-3 mr-1" />
                              Falta
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Faltas Detalhadas */}
              {attendanceHistory.filter(a => !a.present).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Registro de Faltas</CardTitle>
                    <CardDescription>
                      Sessões em que o skatista esteve ausente
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {attendanceHistory
                        .filter(a => !a.present)
                        .map((record, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50"
                          >
                            <div>
                              <p className="font-medium">{record.sessionTitle}</p>
                              <p className="text-sm text-muted-foreground">
                                {record.date} - {record.sessionType}
                              </p>
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
