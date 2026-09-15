import React, { useState } from 'react';
import { Sidebar, NAV_GROUPS } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { PageNavigation } from './components/layout/PageNavigation';
import { Overview } from './sections/Overview';
import { StartingFromScratch } from './sections/StartingFromScratch';
import { Hierarchy } from './sections/Hierarchy';
import { Spacing } from './sections/Spacing';
import { Typography } from './sections/Typography';
import { Color } from './sections/Color';
import { Depth } from './sections/Depth';
import { Images } from './sections/Images';
import { Responsive } from './sections/Responsive';
import { DarkMode } from './sections/DarkMode';
import { Components } from './sections/Components';
import { ComponentStates } from './sections/ComponentStates';
import { FormsAndDashboards } from './sections/FormsAndDashboards';
import { FormValidation } from './sections/FormValidation';
import { DataTables } from './sections/DataTables';
import { EmptyStates } from './sections/EmptyStates';
import { LoadingStates } from './sections/LoadingStates';
import { Modals } from './sections/Modals';
import { Tabs } from './sections/Tabs';
import { Dropdowns } from './sections/Dropdowns';
import { InputsControls } from './sections/InputsControls';
import { Toasts } from './sections/Toasts';
import { Tooltips } from './sections/Tooltips';
import { CardsAnatomy } from './sections/CardsAnatomy';
import { Avatars } from './sections/Avatars';
import { Accordions } from './sections/Accordions';
import { AdvancedInputs } from './sections/AdvancedInputs';
import { ComplexData } from './sections/ComplexData';
import { AdvancedOverlays } from './sections/AdvancedOverlays';
import { FeedbackIndicators } from './sections/FeedbackIndicators';
import { Breadcrumbs } from './sections/Breadcrumbs';
import { OtpInputs } from './sections/OtpInputs';
import { HoverCards } from './sections/HoverCards';
import { Sliders } from './sections/Sliders';
import { Carousels } from './sections/Carousels';
import { Borders } from './sections/Borders';
import { Motion } from './sections/Motion';
import { Iconography } from './sections/Iconography';
import { Badges } from './sections/Badges';
import { Navigation } from './sections/Navigation';
import { Copywriting } from './sections/Copywriting';
import { DesignTokens } from './sections/DesignTokens';
import { DoDontLibrary } from './sections/DoDontLibrary';
import { UiQualityChecker } from './sections/UiQualityChecker';
import { SectionId, AppState } from './types';

export default function App() {
  const [state, setState] = useState<AppState>({
    currentSection: 'overview',
    agentMode: false,
    searchQuery: '',
    sidebarOpen: false,
  });

  const handleSelectSection = (id: SectionId) => {
    setState(s => ({ ...s, currentSection: id, sidebarOpen: false }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleAgentMode = () => {
    setState(s => ({ ...s, agentMode: !s.agentMode }));
  };

  const handleSearchChange = (query: string) => {
    setState(s => ({ ...s, searchQuery: query }));
  };
  
  const handleToggleSidebar = () => {
    setState(s => ({ ...s, sidebarOpen: !s.sidebarOpen }));
  };

  // Simple routing
  const renderSection = () => {
    const props = { agentMode: state.agentMode };
    switch (state.currentSection) {
      case 'overview': return <Overview {...props} />;
      case 'starting': return <StartingFromScratch {...props} />;
      case 'hierarchy': return <Hierarchy {...props} />;
      case 'spacing': return <Spacing {...props} />;
      case 'typography': return <Typography {...props} />;
      case 'color': return <Color {...props} />;
      case 'depth': return <Depth {...props} />;
      case 'images': return <Images {...props} />;
      case 'responsive': return <Responsive {...props} />;
      case 'dark-mode': return <DarkMode {...props} />;
      case 'components': return <Components {...props} />;
      case 'component-states': return <ComponentStates {...props} />;
      case 'forms-dashboards': return <FormsAndDashboards {...props} />;
      case 'form-validation': return <FormValidation {...props} />;
      case 'data-tables': return <DataTables {...props} />;
      case 'badges': return <Badges {...props} />;
      case 'navigation': return <Navigation {...props} />;
      case 'empty-states': return <EmptyStates {...props} />;
      case 'loading-states': return <LoadingStates {...props} />;
      case 'modals': return <Modals {...props} />;
      case 'tabs': return <Tabs {...props} />;
      case 'dropdowns': return <Dropdowns {...props} />;
      case 'inputs-controls': return <InputsControls {...props} />;
      case 'toasts': return <Toasts {...props} />;
      case 'tooltips': return <Tooltips {...props} />;
      case 'cards-anatomy': return <CardsAnatomy {...props} />;
      case 'avatars': return <Avatars {...props} />;
      case 'accordions': return <Accordions {...props} />;
      case 'advanced-inputs': return <AdvancedInputs {...props} />;
      case 'complex-data': return <ComplexData {...props} />;
      case 'advanced-overlays': return <AdvancedOverlays {...props} />;
      case 'feedback-indicators': return <FeedbackIndicators {...props} />;
      case 'breadcrumbs': return <Breadcrumbs {...props} />;
      case 'otp-inputs': return <OtpInputs {...props} />;
      case 'hover-cards': return <HoverCards {...props} />;
      case 'sliders': return <Sliders {...props} />;
      case 'carousels': return <Carousels {...props} />;
      case 'borders': return <Borders {...props} />;
      case 'motion': return <Motion {...props} />;
      case 'iconography': return <Iconography {...props} />;
      case 'copywriting': return <Copywriting {...props} />;
      case 'design-tokens': return <DesignTokens {...props} />;
      case 'do-dont': return <DoDontLibrary {...props} />;
      case 'checklist': return <UiQualityChecker {...props} />;
      default: return <StartingFromScratch {...props} />;
    }
  };

  const flatItems = NAV_GROUPS.flatMap(group => group.items);
  const currentIndex = flatItems.findIndex(item => item.id === state.currentSection);
  const prevItem = currentIndex > 0 ? flatItems[currentIndex - 1] : undefined;
  const nextItem = currentIndex >= 0 && currentIndex < flatItems.length - 1 ? flatItems[currentIndex + 1] : undefined;

  return (
    <div className="flex h-screen overflow-hidden bg-white text-neutral-900 font-body">
      <Sidebar 
        currentSection={state.currentSection} 
        onSelect={handleSelectSection} 
        agentMode={state.agentMode}
        isOpen={state.sidebarOpen}
        searchQuery={state.searchQuery}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header 
          agentMode={state.agentMode} 
          onToggleAgentMode={handleToggleAgentMode}
          searchQuery={state.searchQuery}
          onSearchChange={handleSearchChange}
          onToggleSidebar={handleToggleSidebar}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          {renderSection()}
          
          <PageNavigation 
            prevSection={prevItem}
            nextSection={nextItem}
            onSelect={handleSelectSection}
          />
          
          <div className="mt-8 pt-8 border-t border-neutral-200 text-center max-w-2xl mx-auto pb-16">
            <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4">Core Philosophy</p>
            <p className="text-lg text-neutral-600 italic">
              "Good UI is not the UI with the most decoration. Good UI is the UI where the right things are obvious."
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
