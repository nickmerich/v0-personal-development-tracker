"use client"

import type React from "react"
import { Modal, Button } from "antd"

interface WelcomeModalProps {
  visible: boolean
  onClose: () => void
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      title="Welcome!"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <h1>Build Your Best Life</h1>
      <p>
        Start your building journey and construct the future you've always dreamed of. This platform provides the tools
        and resources you need to build strong foundations, develop essential skills, and grow into the best version of
        yourself. Let's build something amazing together!
      </p>
    </Modal>
  )
}

export default WelcomeModal
