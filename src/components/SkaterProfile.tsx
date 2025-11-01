import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, User, FileText, Calendar, Plus, Save } from 'lucide-react';

interface SkaterProfileProps {
  skaterId: number;
  onBack: () => void;
}

export function SkaterProfile({ skaterId, onBack }: SkaterProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newNote, setNewNote] = useState('');
  
  const skater = {
    id: 1,
    name: 'João Silva',
    cpf: '123.456.789-00',
    cep: '01310-100',
    gender: 'Masculino',
    school: 'Colégio São Paulo',
    level: 'Intermediário',
    enrollmentDate: '2024-03-15',
    totalSessions: 45
  };

  const notes = [
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
      content: 'João participou do campeonato amador da escola. Executou sua run com segurança, incluindo ollies, manuals e tentativa de kickflip. Classificou-se em 5º lugar na categoria iniciante-intermediário. Comportamento exemplar e espírito esportivo.',
      instructor: 'Bruno Oliveira',
      sessionType: 'Competição'
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
    if (newNote.trim()) {
      // Aqui seria adicionado ao banco de dados
      console.log('Nova nota:', newNote);
      setNewNote('');
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
          <TabsList>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Informações Básicas
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Anotações e Relatórios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="" />
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
                        value={skater.name}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        value={skater.cpf}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cep">CEP</Label>
                      <Input
                        id="cep"
                        value={skater.cep}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="gender">Gênero</Label>
                      <Input
                        id="gender"
                        value={skater.gender}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="school">Escola Cadastrada</Label>
                      <Input
                        id="school"
                        value={skater.school}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="level">Nível</Label>
                      <Input
                        id="level"
                        value={skater.level}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={() => setIsEditing(false)}>
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
                    <Label htmlFor="newNote">Anotação ou Relatório</Label>
                    <Textarea
                      id="newNote"
                      placeholder="Descreva o desempenho, progressos, dificuldades ou observações relevantes da sessão de treino..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="mt-2 min-h-[120px]"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSaveNote} disabled={!newNote.trim()}>
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
        </Tabs>
      </main>
    </div>
  );
}
