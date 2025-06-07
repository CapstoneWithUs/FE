// ==========================================
// 📁 components/SessionWarningModal.jsx - 새로 생성
// ==========================================

import React from 'react';
import { createPortal } from 'react-dom';

const SessionWarningModal = ({ isOpen, onSaveAndExit, onExitWithoutSave, onCancel }) => {
  if (!isOpen) return null;

  const modalStyles = {
    // 오버레이 스타일
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      animation: 'fadeIn 0.3s ease-out'
    },

    // 모달 컨테이너 스타일
    modal: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.9) 100%)',
      borderRadius: '1.5rem',
      padding: '2rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(91, 155, 213, 0.1)',
      border: '2px solid #B4D2F7',
      backdropFilter: 'blur(20px)',
      maxWidth: '500px',
      width: '90%',
      animation: 'slideIn 0.3s ease-out',
      fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },

    // 헤더 스타일
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1.5rem',
      gap: '0.75rem'
    },

    // 아이콘 스타일
    icon: {
      fontSize: '2.5rem',
      filter: 'drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3))'
    },

    // 제목 스타일
    title: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#4472C4',
      margin: 0,
      textShadow: '0 1px 2px rgba(68, 114, 196, 0.1)'
    },

    // 메시지 스타일
    message: {
      fontSize: '1rem',
      color: '#495057',
      lineHeight: '1.6',
      textAlign: 'center',
      marginBottom: '2rem',
      padding: '1rem',
      background: 'rgba(91, 155, 213, 0.05)',
      borderRadius: '0.75rem',
      border: '1px solid rgba(91, 155, 213, 0.1)'
    },

    // 버튼 컨테이너 스타일
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    },

    // 기본 버튼 스타일
    button: {
      padding: '1rem 1.5rem',
      borderRadius: '0.75rem',
      fontWeight: '600',
      fontSize: '1rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      minHeight: '52px'
    },

    // 저장 후 나가기 버튼
    saveButton: {
      background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
      color: '#FFFFFF',
      border: '2px solid transparent'
    },

    // 저장 없이 나가기 버튼
    exitButton: {
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      color: '#FFFFFF',
      border: '2px solid transparent'
    },

    // 취소 버튼
    cancelButton: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      color: '#4472C4',
      border: '2px solid #B4D2F7'
    }
  };

  const globalStyles = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideIn {
      from { 
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
      }
      to { 
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `;

  return createPortal(
    <>
      <style>{globalStyles}</style>
      <div style={modalStyles.overlay} onClick={onCancel}>
        <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
          {/* 헤더 */}
          <div style={modalStyles.header}>
            <span style={modalStyles.icon}>⚠️</span>
            <h2 style={modalStyles.title}>측정 중 나가기</h2>
          </div>

          {/* 메시지 */}
          <div style={modalStyles.message}>
            현재 집중력 측정이 진행 중입니다.<br />
            페이지를 나가면 측정된 데이터가 손실될 수 있습니다.<br />
            어떻게 진행하시겠습니까?
          </div>

          {/* 버튼들 */}
          <div style={modalStyles.buttonContainer}>
            <button
              style={{...modalStyles.button, ...modalStyles.saveButton}}
              onClick={onSaveAndExit}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(74, 222, 128, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
            >
              💾 저장 후 나가기
            </button>

            <button
              style={{...modalStyles.button, ...modalStyles.exitButton}}
              onClick={onExitWithoutSave}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(245, 158, 11, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
            >
              🚪 저장 없이 나가기
            </button>

            <button
              style={{...modalStyles.button, ...modalStyles.cancelButton}}
              onClick={onCancel}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(91, 155, 213, 0.2)';
                e.target.style.background = 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                e.target.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)';
              }}
            >
              ❌ 취소 (현재 화면 유지)
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default SessionWarningModal;