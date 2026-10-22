import React from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface AuthenticBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthenticBoardModal: React.FC<AuthenticBoardModalProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#fffdfa] border-4 border-amber-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-950">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-amber-900/20 bg-[#f7ede0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border-2 border-amber-700 flex items-center justify-center text-amber-900 shadow-xs">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-base sm:text-lg text-amber-950">
                {language === 'en'
                  ? 'Traditional Ntxuva Board & Canhu Seeds'
                  : language === 'fr'
                  ? 'Plateau Traditionnel du Ntxuva & Graines'
                  : 'Tabuleiro Tradicional do Ntxuva & Sementes de Canhu'}
              </h2>
              <p className="text-xs text-stone-800 font-bold">
                {language === 'en'
                  ? 'Authentic visual references from Southern Mozambique'
                  : language === 'fr'
                  ? 'Références visuelles authentiques du Sud du Mozambique'
                  : 'Referência visual autêntica da arte de esculpir em madeira no Sul de Moçambique'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#ede2d5] hover:bg-[#dfd0be] text-stone-900 transition-all cursor-pointer font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com Imagens */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Imagem Principal do Tabuleiro */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-black text-amber-950">
              <span>★ {language === 'en' ? 'Solid Wood Carved Board (4 Rows × 8 Pits)' : language === 'fr' ? 'Plateau en Bois Massif (4 Rangées × 8 Fosses)' : 'Tabuleiro Esculpido em Madeira Maciça (4 Filas × 8 Casas)'}</span>
              <span className="text-stone-800 font-mono text-xs font-bold">{language === 'en' ? 'Traditional Art' : language === 'fr' ? 'Art Traditionnel' : 'Arte Tradicional Moçambicana'}</span>
            </div>
            <div className="relative rounded-2xl overflow-hidden border-2 border-amber-900/40 shadow-xl bg-black">
              <img
                src="/src/assets/images/african_ntxuva_board_1792678914279.jpg"
                alt="Tabuleiro autêntico do Ntxuva"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover max-h-[45vh]"
              />
            </div>
            <p className="text-xs text-stone-900 font-bold leading-relaxed">
              {language === 'en'
                ? 'Photograph of a traditional Ntxuva board: hand-carved in noble wood (Kiaat/African Teak), featuring 32 central sowing hollows, lateral reserve cavities for captured seeds, and identity geometric carvings along the borders.'
                : language === 'fr'
                ? 'Photographie du plateau traditionnel du Ntxuva: sculpté à la main dans un bois précieux (Kiaat/Teck africain), avec 32 alvéoles centrales de semis, cavités latérales de réserve et gravures géométriques identitaires.'
                : 'Fotografia do tabuleiro tradicional do Ntxuva: esculpido à mão em tora de madeira nobre (Kiaat/Pau-Preto), apresentando os 32 orifícios centrais escavados para a semeadura, quatro cavidades laterais para resguardo de capturas e entalhes geométricos identitários nas bordas.'}
            </p>
          </div>

          {/* Sementes Reais de Canhu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t-2 border-amber-900/20">
            <div className="space-y-2">
              <span className="text-xs font-black text-amber-950 block">
                {language === 'en' ? 'Botanical Canhu Seeds (Marula Stones)' : language === 'fr' ? 'Graines Botaniques de Canhu (Noyaux de Marula)' : 'Sementes Botânicas de Canhu (Marula / Canho)'}
              </span>
              <div className="relative rounded-2xl overflow-hidden border-2 border-amber-900/40 shadow-lg bg-black aspect-square max-w-xs mx-auto">
                <img
                  src="/src/assets/images/canhu_seeds_macro_1792678915460.jpg"
                  alt="Sementes tradicionais de canhu e marula"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-3 text-xs text-stone-900 font-bold leading-relaxed">
              <div className="p-4 rounded-xl bg-[#f5ecdf] border-2 border-amber-900/25">
                <h4 className="font-black text-amber-950 text-sm mb-1">
                  {language === 'en' ? 'Seed Origins' : language === 'fr' ? 'Origine des Graines' : 'Origem das Sementes'}
                </h4>
                <p>
                  {language === 'en'
                    ? 'Traditionally, players use canhu seeds (woody endocarps of the marula fruit, Sclerocarya birrea), highly abundant across Southern Mozambique. Handled over decades, they develop a polished sheen and an acoustic snap when hitting the wood.'
                    : language === 'fr'
                    ? 'Traditionnellement, les joueurs utilisent les graines de canhu (endocarpes de marula, Sclerocarya birrea), très abondantes au Sud du Mozambique. Polis par des années de pratique, ils produisent un son sec et caractéristique.'
                    : 'Tradicionalmente, os jogadores utilizam o canhu (endocarpos lenhosos da fruta da marula, Sclerocarya birrea), muito abundantes no Sul de Moçambique. Ao serem manuseadas durante anos de jogo, as cascas ganham um polimento natural liso e um som característico ao colidirem na madeira.'}
                </p>
              </div>
            </div>
          </div>

          {/* O Solo de Areia Natural e o Jogo ao Ar Livre */}
          <div className="pt-4 border-t-2 border-amber-900/20 space-y-3">
            <div className="flex items-center justify-between text-xs font-black text-amber-950">
              <span>{language === 'en' ? 'Natural Sand Ground: Pits Dug in the Earth' : language === 'fr' ? 'Sable Naturel: Fosses Creusées à Même la Terre' : 'Área Natural & Solo de Areia: O Tabuleiro Tradicional Escavado'}</span>
              <span className="text-stone-800 font-mono text-xs font-bold">{language === 'en' ? 'Community Heritage' : language === 'fr' ? 'Patrimoine Communautaire' : 'Tradição Comunitária'}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              <div className="md:col-span-1 relative rounded-2xl overflow-hidden border-2 border-amber-900/40 shadow-lg bg-black aspect-video md:aspect-square">
                <img
                  src="/src/assets/images/mozambique_natural_sand_ground_1792692127524.jpg"
                  alt="Solo e areia natural moçambicana da savana"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:col-span-2 text-xs text-stone-900 font-bold leading-relaxed space-y-2">
                <p>
                  {language === 'en'
                    ? 'In many villages and towns across Southern Mozambique, Ntxuva does not even require wooden planks: players dig 32 holes directly into the natural reddish savanna sand under the cool shade of acacia or canhoeiro trees.'
                    : language === 'fr'
                    ? 'Dans de nombreux villages du Sud du Mozambique, le Ntxuva ne nécessite aucune planche: les joueurs creusent directement 32 fosses dans le sable roux de la savane sous l’ombre bienfaisante des acacias.'
                    : 'Em muitas aldeias e bairros do Sul de Moçambique, o Ntxuva não requer sequer pranchas de madeira: os jogadores utilizam os dedos ou pequenos paus para escavar directamente 32 covas na areia natural avermelhada do chão sob a sombra fresca de acácias ou canhoeiros.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="px-6 py-4 border-t-2 border-amber-900/20 bg-[#f7ede0] flex items-center justify-between text-xs text-stone-800 font-black">
          <span>BOA-MZ · {language === 'en' ? 'Cultural Heritage & Preservation' : language === 'fr' ? 'Patrimoine Culturel & Préservation' : 'Cultura Material e Preservação do Ntxuva'}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-amber-50 font-black cursor-pointer transition-all border-2 border-amber-600 shadow-xs"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
