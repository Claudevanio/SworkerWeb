'use client';
import { useEffect, useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Box,
  Skeleton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Image from 'next/image';
import { MenuButton } from './ui/menuButton';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { set } from 'react-hook-form';
import { usePathname, useRouter } from 'next/navigation';
import {
  AccountCircleOutlined,
  AdminPanelSettingsOutlined,
  ApartmentOutlined,
  ArticleOutlined,
  Close,
  Feedback,
  Handshake,
  HomeOutlined,
  KeyboardArrowDown,
  KeyboardArrowRight,
  LegendToggle,
  ListAltOutlined,
  LogoutOutlined,
  MenuOutlined,
  PendingActions,
  PersonAddAlt1,
  ReportGmailerrorredOutlined,
  SettingsOutlined,
  TurnLeft,
  ViewKanbanOutlined
} from '@mui/icons-material';
import { useUser } from '@/hooks/useUser';
import Cookies from 'js-cookie';
import { Authservice } from '@/services';
import { COLORS } from '@/utils';

const Sidebar: React.FC<{}> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, []);

  const drawerWidth = '280px';

  const currentPage = usePathname();

  const getButtonVariant = (path: string) => (currentPage.includes(path) ? 'primary' : 'secondary');

  const { setUser, user, currentCompany, selectCompany } = useUser();

  const handleLinkPath = (path: string) => {
    if (path === '/' || path === '/perfil') return path;

    if (currentCompany) {
      return `/empresa/${currentCompany?.id}${path}`;
    }

    return '';

    // const currentPath = currentPage.split("/").slice(0, -1).join("/");
  };

  const router = useRouter();

  async function logout() {
    // await Authservice.logout(user.userId);
    setUser(null);
    Cookies.remove('token');
    router.replace('/login');
  }

  // const isLoginPage = currentPage === '/login' || currentPage === "/esqueci-senha"

  const [accordionExpanded, setAccordionExpanded] = useState(
    currentPage === '/servicos-operacionais' || currentPage === '/cadastro-usuario' || currentPage === '/dashboard'
  );

  const [accordionOcurrencesExpanded, setAccordionOcurrencesExpanded] = useState(currentPage === '/ocorrencias');

  useEffect(() => {
    setIsCollapsed(true);
    setIsOpen(false);
  }, [currentPage]);

  if (currentPage === '/login' || currentPage === '/esqueci-senha') return <></>;

  const nomePagina = currentPage.includes('ocorrencias')
    ? 'Ocorrências'
    : currentPage.includes('servicos-o')
      ? 'Serviços Operacionais'
      : currentPage.includes('perfil')
        ? 'Perfil'
        : 'Administração';

  const disabledLinkClassNames = !currentCompany?.id && 'cursor-normal pointer-events-none text-primary-400';

  return (
    <Box
      sx={{
        position: 'relative',
        width: drawerWidth,
        minWidth: drawerWidth,
        '@media (max-width: 768px)': {
          width: '100%',
          position: isOpen ? 'fixed' : 'relative',
          height: '120px',
          backgroundColor: '#FCFEFF',
          zIndex: 5
        }
      }}
    >
      <div className="flex items-center gap-4 px-4 py-6 text-primary-700 font-bold border-b-[.5px] border-[#E3E3E3] md:hidden">
        <IconButton onClick={toggleDrawer} className="text-primary-700">
          {isOpen ? <Close /> : <MenuOutlined />}
        </IconButton>
        {isOpen ? 'Menu Principal' : nomePagina}
      </div>

      <Drawer
        variant={'persistent'}
        anchor="left"
        open={isMobile ? isOpen : true}
        onClose={toggleDrawer}
        sx={{
          width: drawerWidth,
          height: '100vh',
          zIndex: 10,
          position: 'relative',
          '@media (max-width: 768px)': {
            width: '100%',
            height: isOpen ? '100vh' : '0',
            visibility: isOpen ? 'visible' : 'hidden'
          },
          '& .MuiDrawer-paper': {
            backgroundColor: COLORS.base['8'],
            width: drawerWidth,
            boxSizing: 'border-box',
            position: 'relative',
            borderRight: 'none',
            padding: '32px 24px 32px 24px',
            transition: 'width 0.5s ease-in-out',
            gap: '52px',
            display: 'flex',
            flexDirection: 'column',
            '@media (max-width: 768px)': {
              width: '100%'
            }
          }
        }}
      >
        <div className="flex flex-col gap-8 ">
          <div>
            <div className="gap-2 flex pb-4 cursor-pointer items-center ">
              <Avatar />
              <div>
                <h2 className="text-primary-50 text-[20px] font-bold">{user?.companyName}</h2>
                <p className="text-base-4 text-xs font-medium">{user?.name}</p>
              </div>
            </div>
          </div>
            <div>
              <h2
                className="text-primary-50 text-sm mt-[-1rem] font-bold text-center cursor-pointer hover:text-primary-700 hover:underline"
                onClick={selectCompany}
              >
                {
                  currentCompany
                    ? currentCompany.name
                    : 'Selecione uma empresa'
                }
              </h2>
            </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-primary-50 text-xs font-bold">MENU</h2>

            {
              <Link href={handleLinkPath('/')}>
                <MenuButton variant={currentPage === '/' ? 'primary' : 'secondary'} className={`w-full gap-2 flex justify-start`}>
                  <AdminPanelSettingsOutlined />
                  Administração
                </MenuButton>
              </Link>
            }
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-primary-50 text-xs font-bold truncate">
              MENU DA EMPRESA
              {currentCompany && <span className="text-primary-50 text-xs font-bold"> - {currentCompany.name}</span>}
            </h2>

            <Link href={handleLinkPath('/gestao')} className={disabledLinkClassNames}>
              <MenuButton variant={currentPage === '/gestao' ? 'primary' : 'secondary'} className={`w-full gap-2 flex justify-start `}>
                <ApartmentOutlined />
                Gestão
              </MenuButton>
            </Link>

            <Accordion
              expanded={accordionExpanded}
              onChange={() => setAccordionExpanded(!accordionExpanded)}
              sx={{
                backgroundColor: 'transparent',
                padding: 0,
                margin: 0
              }}
            >
              <AccordionSummary
                sx={{
                  backgroundColor: 'transparent',
                  padding: 0,
                  margin: 0,
                  height: '40px'
                }}
              >
                <MenuButton variant={'secondary'} className={`w-full gap-2 flex justify-start`}>
                  <Image src="/linked_services.svg" alt="Imagem" objectFit="contain" width={23} height={23} />
                  Serviços Operacionais
                  <KeyboardArrowDown
                    className="text-primary-400"
                    sx={{
                      rotate: accordionExpanded ? '180deg' : '0deg',
                      transition: 'all 0.3s ease-in-out'
                    }}
                  />
                </MenuButton>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <Link href={handleLinkPath('/servicos-operacionais')} className={disabledLinkClassNames}>
                  <MenuButton
                    variant={currentPage === '/servicos-operacionais' ? 'primary' : 'secondary'}
                    className={`w-full gap-2 px-8 flex justify-start`}
                  >
                    <ViewKanbanOutlined />
                    Dashboard
                  </MenuButton>
                </Link>
                <Link href={handleLinkPath('/servicos-operacionais/ordens-servico')} className={disabledLinkClassNames}>
                  <MenuButton
                    variant={currentPage === '/servicos-operacionais/ordens-servico' ? 'primary' : 'secondary'}
                    className={`w-full gap-2 px-8  flex justify-start`}
                  >
                    <ListAltOutlined />
                    Ordens de serviço
                  </MenuButton>
                </Link>
                <Link href={handleLinkPath('/servicos-operacionais/config')} className={disabledLinkClassNames} passHref>
                  <MenuButton variant={getButtonVariant('/servicos-operacionais/config')} className={`w-full gap-2 flex px-8 justify-start`}>
                    <SettingsOutlined />
                    Configurações
                  </MenuButton>
                </Link>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={accordionOcurrencesExpanded}
              onChange={() => setAccordionOcurrencesExpanded(!accordionOcurrencesExpanded)}
              sx={{
                backgroundColor: 'transparent',
                padding: 0,
                margin: 0
              }}
            >
              <AccordionSummary
                sx={{
                  backgroundColor: 'transparent',
                  padding: 0,
                  margin: 0,
                  height: '40px'
                }}
              >
                <MenuButton variant={getButtonVariant('cadastro-usuario')} className={`w-full gap-2 flex justify-start`}>
                  <Feedback />
                  Ocorrências
                  <KeyboardArrowDown
                    className="text-primary-400"
                    sx={{
                      rotate: accordionOcurrencesExpanded ? '180deg' : '0deg',
                      transition: 'all 0.3s ease-in-out'
                    }}
                  />
                </MenuButton>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <Link href={handleLinkPath('/ocorrencias/dashboard')} className={disabledLinkClassNames}>
                  <MenuButton
                    variant={currentPage === '/ocorrencias/dashboard' ? 'primary' : 'secondary'}
                    className={`w-full gap-2 px-8 flex justify-start`}
                  >
                    <ViewKanbanOutlined />
                    Dashboard
                  </MenuButton>
                </Link>
                <Link href={handleLinkPath('/ocorrencias')} className={disabledLinkClassNames}>
                  <MenuButton variant={currentPage === '/ocorrencias' ? 'primary' : 'secondary'} className={`w-full gap-2 px-8 flex justify-start`}>
                    <ReportGmailerrorredOutlined />
                    Ocorrências
                  </MenuButton>
                </Link>
                <Link href={handleLinkPath('/ocorrencias/config')} className={disabledLinkClassNames}>
                  <MenuButton
                    variant={currentPage === '/ocorrencias/config' ? 'primary' : 'secondary'}
                    className={`w-full gap-2 px-8 flex justify-start`}
                  >
                    <SettingsOutlined />
                    Configurações
                  </MenuButton>
                </Link>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>

        <div className="flex flex-col gap-2 pb-24 md:pb-0">
          <h2 className="text-primary-50 text-xs font-bold">PERFIL</h2>
          {
            <Link href={handleLinkPath('/perfil')}>
              <MenuButton variant={currentPage === '/perfil' ? 'primary' : 'secondary'} className={`w-full gap-2 flex justify-start`}>
                <AccountCircleOutlined />
                Meu Perfil
              </MenuButton>
            </Link>
          }
          <MenuButton variant={getButtonVariant('cadastro-usuario')} className={`w-full gap-2 flex justify-start !text-erro-2`} onClick={logout}>
            <LogoutOutlined />
            Sair
          </MenuButton>
        </div>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
