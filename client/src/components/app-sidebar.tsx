import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BookOpen, 
  PenTool, 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CheckSquare, 
  LogOut 
} from "lucide-react";

export function AppSidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  
  // Safely cast user to access extended properties
  const role = (user as any)?.role || 'student';
  const name = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email || 'Usuário';

  const menuItems = {
    student: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Nova Redação", url: "/escrever", icon: PenTool },
      { title: "Meu Histórico", url: "/redacoes", icon: BookOpen },
    ],
    teacher: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Correções Pendentes", url: "/correcoes", icon: CheckSquare },
      { title: "Minhas Turmas", url: "/turmas", icon: GraduationCap },
      { title: "Todas as Redações", url: "/redacoes", icon: BookOpen },
    ],
    admin: [
      { title: "Visão Geral", url: "/", icon: LayoutDashboard },
      { title: "Gestão de Turmas", url: "/turmas", icon: GraduationCap },
      { title: "Gestão de Usuários", url: "/usuarios", icon: Users },
    ]
  };

  const items = menuItems[role as keyof typeof menuItems] || menuItems.student;

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <PenTool size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold font-display tracking-tight text-foreground leading-none">RedaX</span>
            <span className="text-[10px] uppercase font-semibold text-primary tracking-widest mt-1">Platform</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                    className="rounded-lg transition-all duration-200"
                  >
                    <Link href={item.url} className="flex items-center gap-3 py-2.5">
                      <item.icon size={18} className={location === item.url ? "text-primary" : "text-muted-foreground"} />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border/50 mb-4">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={user?.profileImageUrl || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold truncate">{name}</span>
            <span className="text-xs text-muted-foreground capitalize">{role === 'student' ? 'Aluno' : role === 'teacher' ? 'Professor' : 'Admin'}</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 transition-colors" 
          onClick={() => logout()}
        >
          <LogOut size={16} />
          Sair da conta
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
