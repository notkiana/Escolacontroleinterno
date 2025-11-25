import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, User, Mail, Phone, Calendar, Award, Edit, Save, Users, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface InstructorProfileProps {
  onBack: () => void;
}

export function InstructorProfile({ onBack }: InstructorProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('instructorProfile');
    return saved ? JSON.parse(saved) : {
      name: 'Bruno Oliveira',
      email: 'bruno.oliveira@skateflow.com',
      phone: '(11) 99999-9999',
      cpf: '123.456.789-00',
      specialty: 'Street & Rampa',
      experience: '8 anos',
      certification: 'CBSK - Instrutor Nível 3',
      photo: '',
      joinDate: '2017-03-15'
    };
  });

  const [formData, setFormData] = useState(profile);
  const [stats, setStats] = useState({
    totalSkaters: 0,
    activeSessions: 0,
    hoursThisMonth: 0
  });

  useEffect(() => {
    // Calcular estatísticas
    const skaters = JSON.parse(localStorage.getItem('skaters') || '[]');
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');

    // Calcular horas do mês
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    let totalPresences = 0;

    sessions.forEach((session: any) => {
      const sessionDate = new Date(session.dateTime);
      if (sessionDate >= firstDayOfMonth && sessionDate <= now) {
        const attendance = JSON.parse(localStorage.getItem(`session_${session.id}_attendance`) || '[]');
        const presentCount = attendance.filter((a: any) => a.present).length;
        totalPresences += presentCount;
      }
    });

    setStats({
      totalSkaters: skaters.length,
      activeSessions: sessions.length,
      hoursThisMonth: totalPresences
    });
  }, []);

  const handleSave = () => {
    localStorage.setItem('instructorProfile', JSON.stringify(formData));
    setProfile(formData);
    setIsEditing(false);
    toast.success('Perfil atualizado com sucesso!');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
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
            <h1>Perfil do Instrutor</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie suas informações pessoais e profissionais
            </p>
          </div>
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancelar' : 'Editar Perfil'}
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Informações Principais */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={isEditing ? formData.photo : profile.photo} />
                  <AvatarFallback className="text-2xl">
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                    <Edit className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <Label>Nome Completo</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl mb-2">{profile.name}</h2>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-primary/10 text-primary">Instrutor Principal</Badge>
                      <Badge variant="outline">{profile.certification}</Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {profile.experience} de experiência • Especialidade em {profile.specialty}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-semibold">{stats.totalSkaters}</div>
                <p className="text-sm text-muted-foreground">Skatistas</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-semibold">{stats.activeSessions}</div>
                <p className="text-sm text-muted-foreground">Sessões Agendadas</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-semibold">{stats.hoursThisMonth}</div>
                <p className="text-sm text-muted-foreground">Horas Este Mês</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
            <CardDescription>Informações de contato e identificação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label>Email</Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                  />
                ) : (
                  <div className="mt-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>

              <div>
                <Label>Telefone</Label>
                {isEditing ? (
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1"
                  />
                ) : (
                  <div className="mt-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <Label>CPF</Label>
                {isEditing ? (
                  <Input
                    value={formData.cpf}
                    onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                    className="mt-1"
                  />
                ) : (
                  <div className="mt-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{profile.cpf}</span>
                  </div>
                )}
              </div>

              <div>
                <Label>Data de Ingresso</Label>
                <div className="mt-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{new Date(profile.joinDate).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Profissionais */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Profissionais</CardTitle>
            <CardDescription>Qualificações e experiência</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label>Especialidade</Label>
                {isEditing ? (
                  <Input
                    value={formData.specialty}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                    className="mt-1"
                  />
                ) : (
                  <div className="mt-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span>{profile.specialty}</span>
                  </div>
                )}
              </div>

              <div>
                <Label>Experiência</Label>
                {isEditing ? (
                  <Input
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    className="mt-1"
                  />
                ) : (
                  <div className="mt-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{profile.experience}</span>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <Label>Certificação</Label>
                {isEditing ? (
                  <Input
                    value={formData.certification}
                    onChange={(e) => setFormData(prev => ({ ...prev, certification: e.target.value }))}
                    className="mt-1"
                  />
                ) : (
                  <div className="mt-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span>{profile.certification}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {isEditing && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setFormData(profile);
              setIsEditing(false);
            }}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
