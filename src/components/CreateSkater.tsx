import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ArrowLeft, User, Upload, Save } from 'lucide-react';
import { toast } from 'sonner';

interface CreateSkaterProps {
  onBack: () => void;
  skaterId?: number;
}

export function CreateSkater({ onBack, skaterId }: CreateSkaterProps) {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    cep: '',
    gender: 'Masculino',
    phone: '',
    motherName: '',
    fatherName: '',
    susCard: '',
    level: 'Iniciante',
    photo: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    totalSessions: 0,
    lastSession: null
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.name || !formData.cpf) {
      toast.error('Por favor, preencha nome e CPF');
      return;
    }

    // Pegar skatistas existentes do localStorage
    const existingSkaters = JSON.parse(localStorage.getItem('skaters') || '[]');
    
    const newSkater = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    // Adicionar novo skatista
    existingSkaters.push(newSkater);
    localStorage.setItem('skaters', JSON.stringify(existingSkaters));
    
    toast.success('Skatista cadastrado com sucesso!');
    onBack();
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
            <h1>Novo Skatista</h1>
            <p className="text-sm text-muted-foreground">
              Cadastre um novo skatista no sistema
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informações do Skatista</CardTitle>
              <CardDescription>
                Preencha os dados básicos do skatista conforme LGPD
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Foto de Perfil */}
              <div className="flex flex-col items-center gap-4 pb-6 border-b">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={formData.photo} />
                  <AvatarFallback>
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Label htmlFor="photo" className="cursor-pointer">
                    <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <Upload className="w-4 h-4" />
                      Adicionar Foto de Perfil
                    </div>
                  </Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Formatos aceitos: JPG, PNG (máx. 5MB)
                  </p>
                </div>
              </div>

              {/* Campos do Formulário */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Digite o nome completo"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                      placeholder="000.000.000-00"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => setFormData(prev => ({ ...prev, cep: e.target.value }))}
                      placeholder="00000-000"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender">Gênero</Label>
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-1"
                    >
                      <option>Masculino</option>
                      <option>Feminino</option>
                      <option>Outro</option>
                      <option>Prefiro não informar</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="motherName">Nome da Mãe</Label>
                    <Input
                      id="motherName"
                      value={formData.motherName}
                      onChange={(e) => setFormData(prev => ({ ...prev, motherName: e.target.value }))}
                      placeholder="Nome completo da mãe"
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
                      placeholder="(00) 00000-0000"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fatherName">Nome do Pai</Label>
                    <Input
                      id="fatherName"
                      value={formData.fatherName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fatherName: e.target.value }))}
                      placeholder="Nome completo do pai"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="susCard">Carteirinha do SUS</Label>
                    <Input
                      id="susCard"
                      value={formData.susCard}
                      onChange={(e) => setFormData(prev => ({ ...prev, susCard: e.target.value }))}
                      placeholder="000 0000 0000 0000"
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

              {/* Botões de Ação */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onBack}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Skatista
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
}
