import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Layers,
  Lock,
  Shield,
  ShieldCheck,
  Clock,
  Key,
  Users,
  Monitor,
  Globe,
  ChevronLeft,
  ChevronRight,
  X,
  Copy,
  Cpu,
  Check,
  Home,
  Info,
  Zap,
  Eye,
  Image,
  Github,
  Chrome,
  Code,
  Wrench,
  BookOpen,
  ArrowDown,
  ExternalLink,
  LayoutGrid,
  Wallet,
  Menu,
} from "lucide-react";
import * as THREE from "three";

/* ──────────────────────────── DATA ──────────────────────────── */

const screenshots = [
  { src: "welcome.png", caption: "Welcome" },
  { src: "dashboard.png", caption: "Dashboard" },
  { src: "private.png", caption: "Private Mode" },
  { src: "multiwallet.png", caption: "Multi-Wallet" },
  { src: "multisend.png", caption: "Multi-Send" },
  { src: "bulksend.png", caption: "Bulk Send" },
];

const apps = [
  {
    name: "OctWa Analyzer",
    description:
      "A lightweight web UI for browsing Octra transactions, addresses, and epochs.",
    appUrl: "https://analyzer.octwa.pw/",
    repoUrl: "https://github.com/m-tq/OctWa-Analyzer",
    screenshotUrl: "analyzer.png",
    icon: Cpu,
  },
  {
    name: "OctWa dApp Starter",
    description:
      "A comprehensive demonstration of the complete Octra blockchain ecosystem integration.",
    appUrl: "https://analyzer.octwa.pw/",
    repoUrl: "https://github.com/m-tq/Starter",
    screenshotUrl: "starter.png",
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" fill="currentColor"/>
        <path d="M16 22C16 20.3431 17.3431 19 19 19H45C46.6569 19 48 20.3431 48 22V24H16V22Z" fill="white" opacity="0.9"/>
        <rect x="16" y="24" width="32" height="20" rx="2" fill="white"/>
        <rect x="20" y="28" width="24" height="3" rx="1.5" fill="currentColor" opacity="0.3"/>
        <rect x="20" y="33" width="16" height="3" rx="1.5" fill="currentColor" opacity="0.3"/>
        <circle cx="40" cy="38" r="3.5" fill="currentColor"/>
        <circle cx="40" cy="38" r="1.5" fill="white"/>
      </svg>
    ),
  },
];

const tools = [
  {
    name: "Octra Tools",
    description:
      "Python CLI tool to generate Octra wallet data from seed phrase (mnemonic). Also, you can create vanity octra address by running octra-vanity.js file.",
    repoUrl: "https://github.com/m-tq/Octra-Tools",
  },
];

const sdkDocsUrl = "https://github.com/m-tq/OctWa/tree/master/packages/sdk";

const navLabels = [
  "Home",
  "About",
  "Features",
  "How It Works",
  "Security",
  "Screenshots",
  "Open Source",
];
const totalSlides = navLabels.length;

type PageKey = "main" | "sdk" | "apps" | "tools";

/* ──────────── Sidebar icon maps ──────────── */
const mainSidebarIcons = [Home, Info, Zap, Eye, ShieldCheck, Image, Code];
const sdkSidebarIcons = [
  BookOpen,
  ArrowDown,
  Code,
  Layers,
  BookOpen,
  Zap,
  Globe,
  ShieldCheck,
  Layers,
];

type CodeSample = { title: string; code: string };
type SdkSection = {
  title: string;
  description: ReactNode;
  bullets?: ReactNode[];
  samples?: CodeSample[];
  actions?: ReactNode;
};

const sdkSections: SdkSection[] = [
  {
    title: "OctWa SDK v1.1.1",
    description:
      "A stateless, deterministic transaction builder for integrating dApps with OctWa Wallet Extension. The SDK provides type-safe APIs, canonical serialization, domain separation for security, and comprehensive error handling.",
    bullets: [
      <>SDK is stateless and never handles private keys - only builds and validates transactions.</>,
      <>Wallet Extension is the final authority for all signing and validation.</>,
      <>Capability-based authorization gives users fine-grained control over dApp permissions.</>,
    ],
    actions: (
      <div className="cta-group">
        <a
          className="btn btn-secondary"
          href={sdkDocsUrl}
          target="_blank"
          rel="noopener"
        >
          <ExternalLink size={16} /> View SDK Documentation
        </a>
      </div>
    ),
  },
  {
    title: "Installation",
    description:
      "Install the package via npm to start building your Octra dApp.",
    samples: [
      { 
        title: "Install via npm", 
        code: "npm install @octwa/sdk" 
      },
      {
        title: "Import in your project",
        code: `import { OctraSDK } from '@octwa/sdk';
import type { Connection, Capability } from '@octwa/sdk';`
      }
    ],
  },
  {
    title: "Quick Start",
    description:
      "Initialize the SDK, connect to a circle, request capabilities, and invoke blockchain methods.",
    samples: [
      {
        title: "Complete integration example",
        code: `import { OctraSDK } from '@octwa/sdk';

// 1. Initialize SDK
const sdk = await OctraSDK.init({ timeout: 3000 });

// 2. Check if wallet is installed
if (!sdk.isInstalled()) {
  console.log('Please install OctWa Wallet extension');
  return;
}

// 3. Connect to a circle
const connection = await sdk.connect({
  circle: 'my_dapp_v1',
  appOrigin: window.location.origin,
});

console.log('Connected:', connection.walletPubKey);

// 4. Request capability
const capability = await sdk.requestCapability({
  circle: 'my_dapp_v1',
  methods: ['get_balance'],
  scope: 'read',
  encrypted: false,
  ttlSeconds: 3600,
});

// 5. Invoke method
const result = await sdk.invoke({
  capabilityId: capability.id,
  method: 'get_balance',
});

if (result.success) {
  const decoder = new TextDecoder();
  const data = JSON.parse(decoder.decode(result.data));
  console.log('Balance:', data.octBalance, 'OCT');
}`,
      },
    ],
  },
  {
    title: "Core Concepts",
    description:
      "Understanding circles, capabilities, and the capability-based authorization model.",
    bullets: [
      <>
        <strong>Circle:</strong> An isolated context that keeps permissions separated per app. 
        Each dApp should use a unique circle identifier.
      </>,
      <>
        <strong>Capability:</strong> A signed permission token that authorizes specific methods 
        with time-bound access. Scoped by <code className="sdk-inline-code">read</code>, <code className="sdk-inline-code">write</code>, or <code className="sdk-inline-code">compute</code>.
      </>,
      <>
        <strong>Invocation:</strong> Executing a blockchain method using a valid capability. 
        Methods include <code className="sdk-inline-code">get_balance</code>, <code className="sdk-inline-code">send_transaction</code>, and <code className="sdk-inline-code">invoke_compute</code>.
      </>,
    ],
    samples: [
      {
        title: "Capability interface",
        code: `interface Capability {
  id: string;              // Unique capability ID
  circle: string;          // Circle identifier
  methods: string[];       // Authorized methods
  scope: 'read' | 'write' | 'compute';
  encrypted: boolean;      // HFHE encryption flag
  appOrigin: string;       // dApp origin
  issuedAt: number;        // Unix timestamp
  expiresAt: number;       // Unix timestamp
  signature: string;       // Wallet signature
  state: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
}`,
      },
    ],
  },
  {
    title: "API Reference",
    description:
      "Complete SDK methods for connection management, capabilities, and invocations.",
    bullets: [
      <>
        <code className="sdk-inline-code">OctraSDK.init(options?)</code> - Initialize SDK with optional timeout
      </>,
      <>
        <code className="sdk-inline-code">sdk.isInstalled()</code> - Check if wallet extension is installed
      </>,
      <>
        <code className="sdk-inline-code">sdk.connect(params)</code> - Establish connection to a circle
      </>,
      <>
        <code className="sdk-inline-code">sdk.disconnect()</code> - Disconnect from current circle
      </>,
      <>
        <code className="sdk-inline-code">sdk.requestCapability(params)</code> - Request permission for methods
      </>,
      <>
        <code className="sdk-inline-code">sdk.invoke(params)</code> - Execute blockchain method
      </>,
      <>
        <code className="sdk-inline-code">sdk.signMessage(message)</code> - Sign arbitrary message
      </>,
      <>
        <code className="sdk-inline-code">sdk.listCapabilities()</code> - List all active capabilities
      </>,
      <>
        <code className="sdk-inline-code">sdk.renewCapability(id)</code> - Extend capability expiration
      </>,
      <>
        <code className="sdk-inline-code">sdk.revokeCapability(id)</code> - Revoke capability programmatically
      </>,
    ],
    samples: [
      {
        title: "Connection management",
        code: `// Connect
const connection = await sdk.connect({
  circle: 'my_circle',
  appOrigin: window.location.origin,
});

// Get session state
const session = sdk.getSessionState();
console.log('Connected:', session.isConnected);

// Disconnect
await sdk.disconnect();`,
      },
      {
        title: "Capability lifecycle",
        code: `// Request capability
const cap = await sdk.requestCapability({
  circle: 'my_circle',
  methods: ['get_balance', 'send_transaction'],
  scope: 'write',
  encrypted: false,
  ttlSeconds: 7200,
});

// List all capabilities
const allCaps = await sdk.listCapabilities();

// Renew capability (extends by 15 minutes)
const renewed = await sdk.renewCapability(cap.id);

// Revoke capability
await sdk.revokeCapability(cap.id);`,
      },
    ],
  },
  {
    title: "Method Invocation",
    description:
      "Invoke blockchain methods with different capability scopes.",
    bullets: [
      <>
        <strong>Read scope:</strong> Query blockchain state without modifications. 
        Example: <code className="sdk-inline-code">get_balance</code>
      </>,
      <>
        <strong>Write scope:</strong> Submit state-changing transactions. 
        Example: <code className="sdk-inline-code">send_transaction</code>
      </>,
      <>
        <strong>Compute scope:</strong> Execute HFHE encrypted computations. 
        Example: <code className="sdk-inline-code">invoke_compute</code>
      </>,
    ],
    samples: [
      {
        title: "Read: Get balance",
        code: `const result = await sdk.invoke({
  capabilityId: readCapability.id,
  method: 'get_balance',
});

if (result.success) {
  const data = JSON.parse(
    new TextDecoder().decode(result.data)
  );
  console.log('Balance:', data.octBalance, 'OCT');
}`,
      },
      {
        title: "Write: Send transaction",
        code: `const txPayload = {
  to: 'oct8UYokvM1DR2QpEVM7oCLvJLPvJqvvvvvvvvvvvvvvvvvvv',
  amount: 0.1,
  message: 'Payment for services'
};

const result = await sdk.invoke({
  capabilityId: writeCapability.id,
  method: 'send_transaction',
  payload: new TextEncoder().encode(
    JSON.stringify(txPayload)
  ),
});`,
      },
      {
        title: "Compute: HFHE computation",
        code: `const computePayload = {
  circuitId: 'neural_net_inference',
  encryptedInput: {
    scheme: 'HFHE',
    data: new Uint8Array([...]), // Encrypted data
    associatedData: 'metadata',
  },
  computeProfile: {
    gateCount: 5000,
    vectorSize: 512,
    depth: 15,
    expectedBootstrap: 3,
  },
  gasLimit: 1000000,
};

const result = await sdk.invoke({
  capabilityId: computeCapability.id,
  method: 'invoke_compute',
  payload: new TextEncoder().encode(
    JSON.stringify(computePayload)
  ),
});`,
      },
    ],
  },
  {
    title: "Gas Estimation",
    description:
      "Estimate transaction costs before submission. Gas formula: OU × 0.0000001 = Fee in OCT",
    bullets: [
      <>
        <code className="sdk-inline-code">estimatePlainTx(params)</code> - Estimate gas for plain transactions
      </>,
      <>
        <code className="sdk-inline-code">estimateEncryptedTx(payload)</code> - Estimate gas for encrypted transactions
      </>,
      <>
        <code className="sdk-inline-code">estimateComputeCost(profile)</code> - Estimate cost for HFHE computations
      </>,
    ],
    samples: [
      {
        title: "Estimate plain transaction",
        code: `const estimate = await sdk.estimatePlainTx({
  to: 'oct...',
  amount: 100
});

console.log('Gas Units:', estimate.gasUnits, 'OU');
console.log('Cost:', estimate.tokenCost, 'OCT');
// Small TX (< 1000 OCT): 10,000 OU = 0.001 OCT
// Large TX (>= 1000 OCT): 30,000 OU = 0.003 OCT`,
      },
      {
        title: "Estimate compute cost",
        code: `const estimate = await sdk.estimateComputeCost({
  gateCount: 5000,
  vectorSize: 512,
  depth: 15,
  expectedBootstrap: 3,
});

console.log('Compute cost:', estimate.tokenCost, 'OCT');`,
      },
    ],
  },
  {
    title: "Events & Listeners",
    description: "Subscribe to SDK events for real-time updates on connection and capability changes.",
    samples: [
      {
        title: "Event listeners",
        code: `// Connection events
sdk.on('connect', ({ connection }) => {
  console.log('Connected:', connection.walletPubKey);
});

sdk.on('disconnect', () => {
  console.log('Disconnected from wallet');
});

// Capability events
sdk.on('capabilityGranted', ({ capability }) => {
  console.log('Capability granted:', capability.id);
});

sdk.on('capabilityRevoked', ({ capabilityId }) => {
  console.log('Capability revoked:', capabilityId);
});

// Extension ready
sdk.on('extensionReady', () => {
  console.log('Wallet extension is ready');
});

// Remove listener
sdk.off('connect', handler);`,
      },
    ],
  },
  {
    title: "Security Features",
    description:
      "Built-in security mechanisms to protect users and ensure transaction integrity.",
    bullets: [
      <>
        <strong>Canonical Serialization:</strong> Deterministic transaction building with sorted keys 
        prevents signature malleability attacks.
      </>,
      <>
        <strong>Domain Separation:</strong> Prevents signature replay attacks across different contexts 
        by including domain-specific prefixes.
      </>,
      <>
        <strong>Signing Mutex:</strong> Automatic protection against race conditions and double-send 
        vulnerabilities during concurrent signing operations.
      </>,
      <>
        <strong>Nonce Management:</strong> SDK provides nonces for transaction ordering, wallet validates 
        to prevent replay attacks.
      </>,
      <>
        <strong>HFHE Encryption:</strong> Encrypted payloads are treated as opaque blobs, ensuring 
        privacy for sensitive computations.
      </>,
    ],
  },
  {
    title: "Error Handling",
    description: "Handle SDK errors gracefully with typed error classes.",
    samples: [
      {
        title: "Error handling patterns",
        code: `import {
  NotInstalledError,
  UserRejectedError,
  TimeoutError,
  InvalidCapabilityError,
} from '@octwa/sdk';

try {
  await sdk.connect({ circle: 'my_app' });
} catch (error) {
  if (error instanceof NotInstalledError) {
    // Wallet extension not installed
    showInstallPrompt();
  } else if (error instanceof UserRejectedError) {
    // User rejected the connection request
    showRejectionMessage();
  } else if (error instanceof TimeoutError) {
    // Request timed out
    showTimeoutMessage();
  } else if (error instanceof InvalidCapabilityError) {
    // Capability expired or invalid
    requestNewCapability();
  }
}`,
      },
    ],
  },
  {
    title: "TypeScript Support",
    description: "Full TypeScript support with comprehensive type definitions for type-safe development.",
    samples: [
      {
        title: "Type imports",
        code: `import type {
  Connection,
  Capability,
  CapabilityRequest,
  InvocationRequest,
  InvocationResult,
  SessionState,
  EncryptedPayload,
  ComputeProfile,
  GasEstimate,
} from '@octwa/sdk';

// Use types in your code
const connection: Connection = await sdk.connect({...});
const capability: Capability = await sdk.requestCapability({...});
const result: InvocationResult = await sdk.invoke({...});`,
      },
    ],
  },
];

/* ──────────────────────────── SMALL COMPONENTS ──────────────────────────── */

const OctwaLogo = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 50 50">
    <circle
      cx="25"
      cy="25"
      r="21"
      stroke="currentColor"
      strokeWidth="8"
      fill="none"
    />
    <circle cx="25" cy="25" r="9" fill="currentColor" />
  </svg>
);

type SlideProps = { index: number; currentSlide: number; children: ReactNode };
const Slide = ({ index, currentSlide, children }: SlideProps) => (
  <section
    className={`slide ${currentSlide === index ? "active" : ""}`}
    data-slide={index}
  >
    <motion.div
      key={`slide-content-${index}`}
      initial={{ opacity: 0, y: 20 }}
      animate={currentSlide === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ 
        width: "100%", 
        height: "100%", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}
    >
      {children}
    </motion.div>
  </section>
);

type SdkSlideProps = {
  index: number;
  currentSlide: number;
  children: ReactNode;
};
const SdkSlide = ({ index, currentSlide, children }: SdkSlideProps) => (
  <section
    className={`sdk-slide ${currentSlide === index ? "active" : ""}`}
    data-slide={index}
  >
    <motion.div
      key={`sdk-slide-content-${index}`}
      initial={{ opacity: 0, y: 20 }}
      animate={currentSlide === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ 
        width: "100%", 
        height: "100%", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}
    >
      {children}
    </motion.div>
  </section>
);

type FeatureCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
};
const FeatureCard = ({
  title,
  description,
  icon,
  className,
}: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className={`feature-card${className ? ` ${className}` : ""}`}
  >
    {icon}
    <h3 className="feature-title">{title}</h3>
    <p className="feature-desc">{description}</p>
  </motion.div>
);

type ModeCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  highlight?: boolean;
};
const ModeCard = ({ title, description, icon, highlight }: ModeCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className={`mode-card${highlight ? " private" : ""}`}
  >
    <h3 className="mode-title">
      {icon}
      {title}
    </h3>
    <p className="mode-desc">{description}</p>
  </motion.div>
);

type SecurityItemProps = {
  title: string;
  description: string;
  icon: ReactNode;
};
const SecurityItem = ({ title, description, icon }: SecurityItemProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="security-item"
  >
    {icon}
    <div className="security-text">
      <strong>{title}</strong>
      <span>{description}</span>
    </div>
  </motion.div>
);

type AppCardProps = {
  name: string;
  description: string;
  appUrl: string;
  repoUrl: string;
  screenshotUrl: string;
  onClick: () => void;
};
const AppCard = ({
  name,
  description,
  screenshotUrl,
  onClick,
}: AppCardProps) => (
  <div
    className="app-card"
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    }}
  >
    <div className="app-image">
      {screenshotUrl ? (
        <img src={screenshotUrl} alt={name} />
      ) : (
        <div className="app-image-placeholder">Screenshot</div>
      )}
    </div>
    <div className="app-body">
      <h3 className="app-title">{name}</h3>
      <p className="app-desc">{description}</p>
    </div>
  </div>
);

type ToolCardProps = { name: string; description: string; repoUrl: string };
const ToolCard = ({ name, description, repoUrl }: ToolCardProps) => (
  <div className="tool-card">
    <div className="tool-body">
      <h3 className="tool-title">{name}</h3>
      <p className="tool-desc">{description}</p>
      <div className="tool-links">
        {repoUrl ? (
          <a
            className="btn btn-secondary"
            href={repoUrl}
            target="_blank"
            rel="noopener"
          >
            <Github size={16} /> Repository
          </a>
        ) : (
          <span className="btn btn-secondary is-disabled">Repository TBD</span>
        )}
      </div>
    </div>
  </div>
);

type CodeBlockProps = {
  sample: CodeSample;
  blockId: string;
  isCopied: boolean;
  onCopy: (text: string, blockId: string) => void;
};
const CodeBlock = ({ sample, blockId, isCopied, onCopy }: CodeBlockProps) => (
  <div className="sdk-code-block">
    <div className="sdk-code-header">
      <span className="sdk-code-title">{sample.title}</span>
      <button
        type="button"
        className={`sdk-copy-btn${isCopied ? " is-copied" : ""}`}
        onClick={() => onCopy(sample.code, blockId)}
        aria-label="Copy code"
      >
        {isCopied ? <Check size={14} /> : <Copy size={14} />}
        <span className="sdk-copy-text">{isCopied ? "Copied" : "Copy"}</span>
      </button>
    </div>
    <pre className="sdk-code">
      <code>{sample.code}</code>
    </pre>
  </div>
);

/* ──────────────────────────── THREE.JS BACKGROUND ──────────────────────────── */

const useOctraBackground = (containerRef: RefObject<HTMLDivElement>) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isLiteMode = window.innerWidth <= 768;
    const NODE_COUNT = isLiteMode ? 260 : 800;
    const CLUSTER_CENTERS: [number, number][] = [
      [-0.5, 0.6],
      [0.5, 0.6],
      [-0.7, 0.0],
      [0.7, 0.0],
      [-0.4, -0.6],
      [0.4, -0.6],
    ];

    const vertexShader = `
      attribute float seed;
      attribute float clusterId;
      uniform float uTime;
      uniform vec2 uResolution;
      varying float vSeed;
      varying float vClusterId;
      varying float vDepth;
      float hash(float n) { return fract(sin(n) * 43758.5453123); }
      float noise(vec3 x) {
        vec3 p = floor(x); vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        float n = p.x + p.y * 57.0 + 113.0 * p.z;
        return mix(mix(mix(hash(n), hash(n+1.0), f.x), mix(hash(n+57.0), hash(n+58.0), f.x), f.y),
                   mix(mix(hash(n+113.0), hash(n+114.0), f.x), mix(hash(n+170.0), hash(n+171.0), f.x), f.y), f.z);
      }
      void main() {
        vSeed = seed; vClusterId = clusterId;
        vec3 pos = position;
        float t1 = uTime * 0.3 + seed * 10.0;
        float orbitRadius = 0.1 + seed * 0.15;
        float orbitSpeed = 0.3 + clusterId * 0.1;
        pos.x += sin(t1 * orbitSpeed) * orbitRadius;
        pos.y += cos(t1 * orbitSpeed * 1.3) * orbitRadius;
        float t2 = uTime * 0.5 + seed * 20.0;
        float noiseScale = 0.5;
        float nx = noise(vec3(pos.xy * noiseScale, t2 * 0.1)) - 0.5;
        float ny = noise(vec3(pos.yx * noiseScale, t2 * 0.1 + 100.0)) - 0.5;
        pos.x += nx * 0.2; pos.y += ny * 0.2;
        vDepth = 0.5 + 0.5 * sin(seed * 6.28);
        float baseSize = 2.5 + seed * 3.0;
        float depthScale = 0.7 + vDepth * 0.6;
        gl_PointSize = baseSize * depthScale;
        float aspect = uResolution.x / uResolution.y;
        pos.x /= aspect;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      varying float vSeed; varying float vClusterId; varying float vDepth;
      uniform float uTime;
      void main() {
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);
        float core = 1.0 - smoothstep(0.0, 0.15, dist);
        float glow = 1.0 - smoothstep(0.0, 0.5, dist);
        float alpha = core * 0.8 + glow * 0.4;
        float colorShift = sin(uTime * 0.2 + vClusterId * 1.5) * 0.5 + 0.5;
        vec3 color1 = vec3(0.227, 0.302, 1.0);
        vec3 color2 = vec3(0.35, 0.45, 1.0);
        vec3 color3 = vec3(0.55, 0.62, 1.0);
        vec3 color4 = vec3(0.3, 0.22, 1.0);
        vec3 baseColor = mix(color1, color2, vSeed);
        baseColor = mix(baseColor, color3, vDepth * 0.3);
        baseColor = mix(baseColor, color4, colorShift * 0.2);
        float brightness = 0.9;
        alpha *= brightness * (0.6 + vDepth * 0.4);
        if (alpha < 0.01) discard;
        gl_FragColor = vec4(baseColor * brightness, alpha);
      }
    `;

    const lineVertexShader = `
      attribute float opacity;
      uniform vec2 uResolution;
      varying float vOpacity;
      void main() {
        vOpacity = opacity;
        vec3 pos = position;
        float aspect = uResolution.x / uResolution.y;
        pos.x /= aspect;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const lineFragmentShader = `
      varying float vOpacity;
      void main() {
        vec3 color = vec3(0.227, 0.302, 1.0);
        float alpha = vOpacity * 0.25;
        gl_FragColor = vec4(color, alpha);
      }
    `;

    const width = container.offsetWidth || window.innerWidth;
    const height = container.offsetHeight || window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: isLiteMode ? "low-power" : "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(
      isLiteMode
        ? Math.min(window.devicePixelRatio, 1.25)
        : Math.min(window.devicePixelRatio, 2),
    );
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(NODE_COUNT * 3);
    const seeds = new Float32Array(NODE_COUNT);
    const clusterIds = new Float32Array(NODE_COUNT);
    const numClusters = CLUSTER_CENTERS.length;

    for (let i = 0; i < NODE_COUNT; i++) {
      const clusterId = i % numClusters;
      const [cx, cy] = CLUSTER_CENTERS[clusterId];
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.4 + Math.random() * 0.3;
      positions[i * 3] = cx + Math.cos(angle) * radius;
      positions[i * 3 + 1] = cy + Math.sin(angle) * radius;
      positions[i * 3 + 2] = 0;
      seeds[i] = Math.random();
      clusterIds[i] = clusterId;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("seed", new THREE.BufferAttribute(seeds, 1));
    geometry.setAttribute(
      "clusterId",
      new THREE.BufferAttribute(clusterIds, 1),
    );

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(width, height) },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const showLines = !isLiteMode;
    let lineGeometry: THREE.BufferGeometry | null = null;
    let lineMaterial: THREE.ShaderMaterial | null = null;
    let lineUniforms: { uTime: { value: number }; uResolution: { value: THREE.Vector2 } } | null =
      null;

    if (showLines) {
      const linePositions: number[] = [];
      const lineOpacities: number[] = [];
      const connectionThreshold = 0.25;

      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          if (clusterIds[i] !== clusterIds[j]) continue;
          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionThreshold) {
            linePositions.push(
              positions[i * 3],
              positions[i * 3 + 1],
              0,
              positions[j * 3],
              positions[j * 3 + 1],
              0,
            );
            const opacity = 1.0 - dist / connectionThreshold;
            lineOpacities.push(opacity, opacity);
          }
        }
      }

      lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(linePositions, 3),
      );
      lineGeometry.setAttribute(
        "opacity",
        new THREE.Float32BufferAttribute(lineOpacities, 1),
      );

      lineUniforms = {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
      };
      lineMaterial = new THREE.ShaderMaterial({
        uniforms: lineUniforms,
        vertexShader: lineVertexShader,
        fragmentShader: lineFragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
      scene.add(lines);
    }

    const startTime = performance.now();
    let frameId = 0;

    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      uniforms.uTime.value = elapsed;
      if (lineUniforms) lineUniforms.uTime.value = elapsed;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = container.offsetWidth || window.innerWidth;
      const h = container.offsetHeight || window.innerHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
      if (lineUniforms) lineUniforms.uResolution.value.set(w, h);
    };
    window.addEventListener("resize", handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      cancelAnimationFrame(frameId);
      geometry.dispose();
      material.dispose();
      lineGeometry?.dispose();
      lineMaterial?.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [containerRef]);
};

/* ──────────────── Page Transition Variants ──────────────── */
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.25, ease: "easeIn" as const },
  },
};

/* ──────────────────────────── MAIN APP ──────────────────────────── */

export default function App() {
  const backgroundRef = useRef<HTMLDivElement>(null);
  useOctraBackground(backgroundRef);

  /* ── State ── */
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const stored = window.localStorage.getItem("octwa-theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  const [currentPage, setCurrentPage] = useState<PageKey>("main");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSdkSlide, setCurrentSdkSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeAppIndex, setActiveAppIndex] = useState<number | null>(null);
  const [activeSdkSection, setActiveSdkSection] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentAppSlide, setCurrentAppSlide] = useState(0);
  const [currentToolSlide, setCurrentToolSlide] = useState(0);

  const visibleSdkSections = useMemo(
    () =>
      sdkSections.filter((s) =>
        Boolean(
          s.title &&
          (s.description ||
            s.bullets?.length ||
            s.samples?.length ||
            s.actions),
        ),
      ),
    [],
  );

  const appScreenshots = useMemo(
    () => apps.map((a) => ({ src: a.screenshotUrl, caption: a.name })),
    [],
  );

  const activeLightboxImages = useMemo(
    () => (currentPage === "apps" ? appScreenshots : screenshots),
    [currentPage, appScreenshots],
  );

  const isAnimatingRef = useRef(false);
  const currentSlideRef = useRef(0);
  const currentSdkSlideRef = useRef(0);
  const currentAppSlideRef = useRef(0);
  const currentToolSlideRef = useRef(0);
  const isMobileRef = useRef(isMobile);
  const wheelTimeoutRef = useRef<number | null>(null);
  const touchStartRef = useRef(0);
  const touchEndRef = useRef(0);
  const copyTimeoutRef = useRef<number | null>(null);

  /* ── Sidebar items (context-aware) ── */
  const sidebarItems = useMemo(() => {
    switch (currentPage) {
      case "main":
        return navLabels.map((label, i) => ({
          label,
          Icon: mainSidebarIcons[i] || Home,
        }));
      case "sdk":
        return visibleSdkSections.map((s, i) => ({
          label: s.title,
          Icon: sdkSidebarIcons[i] || BookOpen,
        }));
      case "apps":
        return apps.map((a) => ({ label: a.name, Icon: a.icon || LayoutGrid }));
      case "tools":
        return tools.map((t) => ({ label: t.name, Icon: Wrench }));
      default:
        return [];
    }
  }, [currentPage, visibleSdkSections]);

  const activeSidebarIndex = useMemo(() => {
    if (currentPage === "main") return currentSlide;
    if (currentPage === "sdk") return currentSdkSlide;
    if (currentPage === "apps") return currentAppSlide;
    if (currentPage === "tools") return currentToolSlide;
    return -1;
  }, [
    currentPage,
    currentSlide,
    currentSdkSlide,
    currentAppSlide,
    currentToolSlide,
  ]);

  /* ── Callbacks ── */
  const handleCopy = useCallback((text: string, blockId: string) => {
    const apply = () => {
      setCopiedId(blockId);
      if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = window.setTimeout(() => setCopiedId(null), 1600);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(apply)
        .catch(() => {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          apply();
        });
      return;
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    apply();
  }, []);

  const handleOpenAppModal = useCallback(
    (index: number) => setActiveAppIndex(index),
    [],
  );
  const handleCloseAppModal = useCallback(() => setActiveAppIndex(null), []);

  const goToAppSlide = useCallback((index: number) => {
    if (isAnimatingRef.current || index === currentAppSlideRef.current) return;
    if (index < 0 || index >= apps.length) return;
    isAnimatingRef.current = true;
    setCurrentAppSlide(index);
    window.setTimeout(() => {
      isAnimatingRef.current = false;
    }, 800);
  }, []);

  const goToToolSlide = useCallback((index: number) => {
    if (isAnimatingRef.current || index === currentToolSlideRef.current) return;
    if (index < 0 || index >= tools.length) return;
    isAnimatingRef.current = true;
    setCurrentToolSlide(index);
    window.setTimeout(() => {
      isAnimatingRef.current = false;
    }, 800);
  }, []);

  const handleOpenSdkSection = useCallback(
    (
      index: number,
      event?:
        | React.MouseEvent<HTMLDivElement>
        | React.KeyboardEvent<HTMLDivElement>,
    ) => {
      const target = event?.target as HTMLElement | null;
      if (target?.closest(".sdk-copy-btn")) return;
      setActiveSdkSection(index);
    },
    [],
  );
  const handleCloseSdkSection = useCallback(
    () => setActiveSdkSection(null),
    [],
  );

  const openLightbox = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  }, []);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  const nextImage = useCallback(
    () => setCurrentImageIndex((p) => (p + 1) % activeLightboxImages.length),
    [activeLightboxImages.length],
  );
  const prevImage = useCallback(
    () =>
      setCurrentImageIndex(
        (p) =>
          (p - 1 + activeLightboxImages.length) % activeLightboxImages.length,
      ),
    [activeLightboxImages.length],
  );

  const goToSlide = useCallback((index: number) => {
    if (isAnimatingRef.current || index === currentSlideRef.current) return;
    if (index < 0 || index >= totalSlides) return;
    isAnimatingRef.current = true;
    setCurrentSlide(index);
    window.setTimeout(() => {
      isAnimatingRef.current = false;
    }, 800);
  }, []);

  const goToSdkSlide = useCallback(
    (index: number) => {
      if (isAnimatingRef.current || index === currentSdkSlideRef.current)
        return;
      if (index < 0 || index >= visibleSdkSections.length) return;
      isAnimatingRef.current = true;
      setCurrentSdkSlide(index);
      window.setTimeout(() => {
        isAnimatingRef.current = false;
      }, 800);
    },
    [visibleSdkSections.length],
  );

  const handleSidebarClick = useCallback(
    (index: number) => {
      switch (currentPage) {
        case "main":
          goToSlide(index);
          break;
        case "sdk":
          goToSdkSlide(index);
          break;
        case "apps":
          goToAppSlide(index);
          break;
        case "tools":
          goToToolSlide(index);
          break;
        default:
          break;
      }
      if (isMobileRef.current) setSidebarOpen(false);
    },
    [currentPage, goToSlide, goToSdkSlide, goToAppSlide, goToToolSlide],
  );

  /* ── Effects ── */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    window.localStorage.setItem("octwa-theme", theme);
  }, [theme]);

  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);
  useEffect(() => {
    currentSdkSlideRef.current = currentSdkSlide;
  }, [currentSdkSlide]);
  useEffect(() => {
    currentAppSlideRef.current = currentAppSlide;
  }, [currentAppSlide]);
  useEffect(() => {
    currentToolSlideRef.current = currentToolSlide;
  }, [currentToolSlide]);
  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const isModalOpen = activeAppIndex !== null || activeSdkSection !== null;
    document.body.classList.toggle("modal-open", isModalOpen);
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [activeAppIndex, activeSdkSection]);

  useEffect(() => {
    const goToMap: Record<string, (i: number) => void> = {
      main: goToSlide,
      sdk: goToSdkSlide,
      apps: goToAppSlide,
      tools: goToToolSlide,
    };
    const refMap: Record<string, React.RefObject<number>> = {
      main: currentSlideRef as React.RefObject<number>,
      sdk: currentSdkSlideRef as React.RefObject<number>,
      apps: currentAppSlideRef as React.RefObject<number>,
      tools: currentToolSlideRef as React.RefObject<number>,
    };
    const maxMap: Record<string, number> = {
      main: totalSlides,
      sdk: visibleSdkSections.length,
      apps: apps.length,
      tools: tools.length,
    };

    const activeGoTo = goToMap[currentPage];
    const activeRef = refMap[currentPage];
    const activeMax = maxMap[currentPage];
    if (!activeGoTo || !activeRef) return;

    const handleWheel = (event: WheelEvent) => {
      if (wheelTimeoutRef.current) window.clearTimeout(wheelTimeoutRef.current);
      wheelTimeoutRef.current = window.setTimeout(() => {
        if (event.deltaY > 0) activeGoTo(activeRef.current + 1);
        else activeGoTo(activeRef.current - 1);
      }, 50);
    };
    const handleTouchStart = (event: TouchEvent) => {
      touchStartRef.current = event.changedTouches[0].screenY;
    };
    const handleTouchEnd = (event: TouchEvent) => {
      touchEndRef.current = event.changedTouches[0].screenY;
      const diff = touchStartRef.current - touchEndRef.current;
      if (Math.abs(diff) > 50) {
        if (diff > 0) activeGoTo(activeRef.current + 1);
        else activeGoTo(activeRef.current - 1);
      }
    };
    const handleKeydown = (event: KeyboardEvent) => {
      if (
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        event.key === " "
      ) {
        event.preventDefault();
        activeGoTo(activeRef.current + 1);
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        activeGoTo(activeRef.current - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        activeGoTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        activeGoTo(activeMax - 1);
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: true });
    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [
    currentPage,
    goToSlide,
    goToSdkSlide,
    goToAppSlide,
    goToToolSlide,
    visibleSdkSections.length,
  ]);

  useEffect(() => {
    const handleResize = () => {
      const nowMobile = window.innerWidth <= 768;
      if (nowMobile !== isMobileRef.current) {
        setIsMobile(nowMobile);
        if (nowMobile) setSidebarOpen(false);
        else {
          setSidebarOpen(true);
          setCurrentSlide(0);
          setCurrentSdkSlide(0);
          setCurrentAppSlide(0);
          setCurrentToolSlide(0);
        }
        setMobileNavOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const shouldLock =
      lightboxOpen ||
      currentPage === "main" ||
      currentPage === "sdk" ||
      currentPage === "apps" ||
      currentPage === "tools";
    document.documentElement.style.overflow = shouldLock ? "hidden" : "auto";
    document.body.style.overflow = shouldLock ? "hidden" : "auto";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, currentPage, isMobile]);

  useEffect(() => {
    if (lightboxOpen) setLightboxOpen(false);
    setMobileNavOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    if (activeSdkSection === null) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseSdkSection();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [activeSdkSection, handleCloseSdkSection]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") nextImage();
      else if (e.key === "ArrowLeft") prevImage();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [closeLightbox, lightboxOpen, nextImage, prevImage]);

  const currentLightbox = useMemo(
    () => activeLightboxImages[currentImageIndex] || activeLightboxImages[0],
    [currentImageIndex, activeLightboxImages],
  );

  const currentPageTitle = useMemo(() => {
    switch (currentPage) {
      case "main":
        return "Home";
      case "sdk":
        return "SDK";
      case "apps":
        return "Apps";
      case "tools":
        return "Tools";
      default:
        return "Home";
    }
  }, [currentPage]);

  /* ── Render helpers ── */
  const renderSdkSectionContent = (
    section: SdkSection,
    sectionIndex: number,
  ) => (
    <>
      <div className="sdk-card-header">
        <h2 className="sdk-card-title">{section.title}</h2>
        <p className="sdk-card-desc">{section.description}</p>
      </div>
      {section.actions && <div className="sdk-actions">{section.actions}</div>}
      {section.bullets && (
        <ul className="sdk-list">
          {section.bullets.map((bullet, bi) => (
            <li key={`${section.title}-b-${bi}`}>{bullet}</li>
          ))}
        </ul>
      )}
      {section.samples?.map((sample, si) => {
        const blockId = `${sectionIndex}-${si}`;
        return (
          <CodeBlock
            key={`${section.title}-${sample.title}`}
            sample={sample}
            blockId={blockId}
            isCopied={copiedId === blockId}
            onCopy={handleCopy}
          />
        );
      })}
    </>
  );

  /* ══════════════════════════════ JSX ══════════════════════════════ */
  return (
    <>
      {/* ─── Fixed Header ─── */}
      <header className="top-nav">
        <div className="top-nav-inner">
          <div className="top-nav-left">
            <button
              type="button"
              className="top-nav-brand"
              onClick={() => {
                setCurrentPage("main");
                goToSlide(0);
                setMobileNavOpen(false);
              }}
            >
              <OctwaLogo size={22} />
              <span>OctWa</span>
            </button>
            <span className="top-nav-title">{currentPageTitle}</span>
          </div>

          <nav className={`top-nav-links${mobileNavOpen ? " is-open" : ""}`}>
            <button
              type="button"
              className={`top-nav-link${currentPage === "main" ? " active" : ""}`}
              onClick={() => {
                setCurrentPage("main");
                goToSlide(0);
                setMobileNavOpen(false);
              }}
            >
              <Home size={15} /> Home
            </button>
            <button
              type="button"
              className={`top-nav-link${currentPage === "sdk" ? " active" : ""}`}
              onClick={() => {
                setCurrentPage("sdk");
                setCurrentSdkSlide(0);
                setMobileNavOpen(false);
              }}
            >
              <BookOpen size={15} /> SDK
            </button>
            <button
              type="button"
              className={`top-nav-link${currentPage === "apps" ? " active" : ""}`}
              onClick={() => {
                setCurrentPage("apps");
                setMobileNavOpen(false);
              }}
            >
              <LayoutGrid size={15} /> Apps
            </button>
            <button
              type="button"
              className={`top-nav-link${currentPage === "tools" ? " active" : ""}`}
              onClick={() => {
                setCurrentPage("tools");
                setMobileNavOpen(false);
              }}
            >
              <Wrench size={15} /> Tools
            </button>
          </nav>

          <div className="top-nav-actions">
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileNavOpen}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* ─── App Body: Sidebar + Main ─── */}
      <div className="app-body">
        <button
          type="button"
          className={`mobile-sidebar-toggle${sidebarOpen ? " is-open" : ""}`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
        >
          {sidebarOpen ? "‹" : "›"}
        </button>
        <aside
          className={`sidebar${sidebarOpen ? " mobile-open" : " collapsed"}`}
        >
          <button
            type="button"
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? '‹' : '›'}
          </button>
          <nav className="sidebar-nav">
            {sidebarItems.map((item, index) => (
              <button
                key={`${item.label}-${index}`}
                className={`sidebar-item${activeSidebarIndex === index ? " active" : ""}`}
                onClick={() => handleSidebarClick(index)}
                title={item.label}
              >
                <item.Icon size={16} />
                <span className="sidebar-item-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Three.js Background — inside main-content so center follows content */}
          <div ref={backgroundRef} className="octra-background" />

          <AnimatePresence mode="wait">
            {/* ════════════ MAIN PAGE ════════════ */}
            {currentPage === "main" && (
              <motion.div
                key="main"
                className="page-transition"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="slides-container">
                  <div
                    className="slides-wrapper"
                    style={
                      {
                        "--slides-offset": `-${currentSlide * 100}%`,
                      } as CSSProperties
                    }
                  >
                    {/* Slide 0: Home */}
                    <Slide index={0} currentSlide={currentSlide}>
                      <div className="slide-content">
                        <h1 className="slide-title">OctWa</h1>
                        <p className="slide-subtitle">
                          The Octra wallet for public and fully encrypted
                          transactions.
                          <br />
                          Encrypted by Default.
                        </p>
                        <div className="cta-group">
                          <a
                            href="https://chromewebstore.google.com/detail/octwa-octra-wallet/celnpgbeekcppnfbhbkcdaajdbibpdai"
                            className="btn btn-primary"
                            target="_blank"
                            rel="noopener"
                          >
                            <Chrome size={18} /> Install from Chrome Web Store
                          </a>
                          <a
                            href="https://github.com/m-tq/OctWa"
                            className="btn btn-secondary"
                            target="_blank"
                            rel="noopener"
                          >
                            <Github size={18} /> View on GitHub
                          </a>
                        </div>
                      </div>
                    </Slide>

                    {/* Slide 1: About */}
                    <Slide index={1} currentSlide={currentSlide}>
                      <div className="slide-content">
                        <h2 className="slide-title">What is OctWa?</h2>
                        <p className="slide-subtitle">
                          A secure browser-based wallet for the Octra blockchain
                          network. Available as both a web application and
                          Chrome/Edge browser extension.
                        </p>
                        <p className="slide-description">
                          OctWa supports two operation modes:{" "}
                          <strong>Public Mode</strong> for standard on-chain
                          transactions, and{" "}
                          <strong className="private-accent">
                            Private Mode
                          </strong>{" "}
                          for fully encrypted transactions powered by Octra
                          HFHE. You control when your data is public or
                          encrypted.
                        </p>
                      </div>
                    </Slide>

                    {/* Slide 2: Features */}
                    <Slide index={2} currentSlide={currentSlide}>
                      <div className="slide-content">
                        <h2 className="slide-title">Key Features</h2>
                        <p className="slide-subtitle">
                          Everything you need for public and private
                          transactions.
                        </p>
                        <div className="features-grid">
                          <FeatureCard
                            title="Public Transactions"
                            description="Send OCT tokens with standard on-chain visibility."
                            icon={<Layers className="feature-icon" />}
                          />
                          <FeatureCard
                            title="Private Transactions"
                            description="Confidential transactions with FHE encryption."
                            className="private"
                            icon={<Lock className="feature-icon" />}
                          />
                          <FeatureCard
                            title="State Control"
                            description="Encrypt or decrypt your balance on demand."
                            icon={<Shield className="feature-icon" />}
                          />
                          <FeatureCard
                            title="Multi-Wallet"
                            description="Manage multiple wallets in a single interface."
                            icon={<Wallet className="feature-icon" />}
                          />
                          <FeatureCard
                            title="Multi-Send"
                            description="Send to multiple recipients. Bulk send via TXT/CSV."
                            icon={<Users className="feature-icon" />}
                          />
                          <FeatureCard
                            title="dApp Integration"
                            description="Web3 provider for dApp connectivity."
                            icon={<Monitor className="feature-icon" />}
                          />
                        </div>
                      </div>
                    </Slide>

                    {/* Slide 3: How It Works */}
                    <Slide index={3} currentSlide={currentSlide}>
                      <div className="slide-content">
                        <h2 className="slide-title">How It Works</h2>
                        <p className="slide-subtitle">
                          Two modes. One wallet. You control the visibility.
                        </p>
                        <div className="modes-grid">
                          <ModeCard
                            title="Public Mode"
                            description="Standard blockchain transactions. Balances and transfer amounts are visible on-chain. Use for everyday transactions where transparency is acceptable or required."
                            icon={<Globe size={24} />}
                          />
                          <ModeCard
                            title="Private Mode"
                            description="Encrypted execution using Fully Homomorphic Encryption (FHE). Balances and amounts remain confidential. Transactions are processed without revealing sensitive data."
                            highlight
                            icon={
                              <ShieldCheck
                                size={24}
                                style={{ color: "hsl(var(--private-primary))" }}
                              />
                            }
                          />
                        </div>
                      </div>
                    </Slide>

                    {/* Slide 4: Security */}
                    <Slide index={4} currentSlide={currentSlide}>
                      <div className="slide-content">
                        <h2 className="slide-title">Security & Philosophy</h2>
                        <p className="slide-subtitle">
                          Your keys. Your control. Always encrypted.
                        </p>
                        <div className="security-grid">
                          <SecurityItem
                            title="Keys Stay Local"
                            description="Private keys never leave your device. All encryption happens locally."
                            icon={<Key className="security-icon" />}
                          />
                          <SecurityItem
                            title="Encrypted-First Design"
                            description="AES-256-GCM encryption. PBKDF2 with 310,000 iterations. Zero unencrypted storage."
                            icon={<Lock className="security-icon" />}
                          />
                          <SecurityItem
                            title="User-Controlled State"
                            description="You decide what's public or private. Encrypt or decrypt on demand."
                            icon={<ShieldCheck className="security-icon" />}
                          />
                          <SecurityItem
                            title="Session Security"
                            description="Auto-lock after 15 min. Session encryption. Memory cleared on lock."
                            icon={<Clock className="security-icon" />}
                          />
                        </div>
                      </div>
                    </Slide>

                    {/* Slide 5: Screenshots */}
                    <Slide index={5} currentSlide={currentSlide}>
                      <div className="slide-content">
                        <h2 className="slide-title">Screenshots</h2>
                        <p className="slide-subtitle">
                          See OctWa in action. Click to view full size.
                        </p>
                        <div className="screenshots-grid">
                          {screenshots.map((shot, index) => (
                            <div
                              key={shot.caption}
                              className="screenshot-item"
                              onClick={() => openLightbox(index)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  openLightbox(index);
                                }
                              }}
                            >
                              <img
                                src={shot.src}
                                alt={shot.caption}
                                loading="lazy"
                              />
                              <span>{shot.caption}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Slide>

                    {/* Slide 6: Open Source */}
                    <Slide index={6} currentSlide={currentSlide}>
                      <div className="slide-content">
                        <a
                          href="https://github.com/m-tq/OctWa"
                          target="_blank"
                          rel="noopener"
                        >
                          <Github className="opensource-icon" />
                        </a>
                        <h2 className="slide-title">Open Source</h2>
                        <p className="slide-subtitle">
                          Community-built and open source. Verify the code,
                          contribute, or build on top of it.
                        </p>
                        <div className="footer-links">
                          <a
                            href="https://github.com/m-tq/OctWa"
                            className="footer-link"
                            target="_blank"
                            rel="noopener"
                          >
                            <Github size={20} /> GitHub
                          </a>
                          <a
                            href="https://chromewebstore.google.com/detail/octwa-octra-wallet/celnpgbeekcppnfbhbkcdaajdbibpdai"
                            className="footer-link"
                            target="_blank"
                            rel="noopener"
                          >
                            <Chrome size={20} /> Chrome Web Store
                          </a>
                        </div>
                        <p className="tagline">
                          OctWa — Encrypted by Default. Verifiable by Design.
                        </p>
                      </div>
                    </Slide>
                  </div>

                  {/* Scroll indicator & counter inside slides container */}
                  <div
                    className={`scroll-indicator ${currentSlide === 0 ? "is-visible" : ""}`}
                  >
                    <span>Scroll</span>
                    <ArrowDown size={20} />
                  </div>
                  <div className="slide-counter">
                    {currentSlide + 1} / {totalSlides}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ════════════ SDK PAGE ════════════ */}
            {currentPage === "sdk" && (
              <motion.div
                key="sdk"
                className="page-transition"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="sdk-slides-container">
                  <div
                    className="sdk-slides-wrapper"
                    style={
                      {
                        "--sdk-offset": `-${currentSdkSlide * 100}%`,
                      } as CSSProperties
                    }
                  >
                    {visibleSdkSections.map((section, si) => (
                      <SdkSlide
                        key={section.title}
                        index={si}
                        currentSlide={currentSdkSlide}
                      >
                        <div className="sdk-slide-content">
                          <div
                            className="sdk-card"
                            role="button"
                            tabIndex={0}
                            onClick={(e) => handleOpenSdkSection(si, e)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleOpenSdkSection(si, e);
                              }
                            }}
                          >
                            {renderSdkSectionContent(section, si)}
                          </div>
                        </div>
                      </SdkSlide>
                    ))}
                  </div>
                </div>
                {activeSdkSection !== null && (
                  <div className="sdk-modal" role="dialog" aria-modal="true">
                    <div
                      className="sdk-modal-backdrop"
                      onClick={handleCloseSdkSection}
                    />
                    <div className="sdk-modal-content">
                      <button
                        type="button"
                        className="sdk-modal-close"
                        aria-label="Close"
                        onClick={handleCloseSdkSection}
                      >
                        <X size={22} />
                      </button>
                      <div className="sdk-modal-body">
                        {renderSdkSectionContent(
                          visibleSdkSections[activeSdkSection],
                          activeSdkSection,
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ════════════ APPS PAGE — 1 sidebar item = 1 slide ════════════ */}
            {currentPage === "apps" && (
              <motion.div
                key="apps"
                className="page-transition"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="slides-container">
                  <div
                    className="slides-wrapper"
                    style={
                      {
                        "--slides-offset": `-${currentAppSlide * 100}%`,
                      } as CSSProperties
                    }
                  >
                    {apps.map((app, index) => (
                      <Slide
                        key={app.name}
                        index={index}
                        currentSlide={currentAppSlide}
                      >
                        <div
                          className="slide-content"
                          style={{ maxWidth: 720 }}
                        >
                          <h2
                            className="slide-title"
                            style={{ fontSize: "2rem" }}
                          >
                            {app.name}
                          </h2>
                          <p className="slide-subtitle">{app.description}</p>

                          {app.screenshotUrl && (
                            <div
                              className="app-detail-image"
                              onClick={() => openLightbox(index)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  openLightbox(index);
                                }
                              }}
                            >
                              <img src={app.screenshotUrl} alt={app.name} />
                            </div>
                          )}

                          <div
                            className="cta-group"
                            style={{ marginTop: "1.5rem" }}
                          >
                            {app.appUrl && (
                              <a
                                className="btn btn-primary"
                                href={app.appUrl}
                                target="_blank"
                                rel="noopener"
                              >
                                <ExternalLink size={16} /> Open App
                              </a>
                            )}
                            {app.repoUrl && (
                              <a
                                className="btn btn-secondary"
                                href={app.repoUrl}
                                target="_blank"
                                rel="noopener"
                              >
                                <Github size={16} /> Repository
                              </a>
                            )}
                          </div>
                        </div>
                      </Slide>
                    ))}
                  </div>
                  <div className="slide-counter">
                    {currentAppSlide + 1} / {apps.length}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ════════════ TOOLS PAGE — 1 sidebar item = 1 slide ════════════ */}
            {currentPage === "tools" && (
              <motion.div
                key="tools"
                className="page-transition"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="slides-container">
                  <div
                    className="slides-wrapper"
                    style={
                      {
                        "--slides-offset": `-${currentToolSlide * 100}%`,
                      } as CSSProperties
                    }
                  >
                    {tools.map((tool, index) => (
                      <Slide
                        key={tool.name}
                        index={index}
                        currentSlide={currentToolSlide}
                      >
                        <div
                          className="slide-content"
                          style={{ maxWidth: 720 }}
                        >
                          <h2
                            className="slide-title"
                            style={{ fontSize: "2rem" }}
                          >
                            {tool.name}
                          </h2>
                          <p className="slide-subtitle">{tool.description}</p>

                          <div
                            className="cta-group"
                            style={{ marginTop: "1.5rem" }}
                          >
                            {tool.repoUrl ? (
                              <a
                                className="btn btn-secondary"
                                href={tool.repoUrl}
                                target="_blank"
                                rel="noopener"
                              >
                                <Github size={16} /> Repository
                              </a>
                            ) : (
                              <span className="btn btn-secondary is-disabled">
                                Repository TBD
                              </span>
                            )}
                          </div>
                        </div>
                      </Slide>
                    ))}
                  </div>
                  <div className="slide-counter">
                    {currentToolSlide + 1} / {tools.length}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* ─── Fixed Mini Footer ─── */}
      <footer className="mini-footer">
        <span>OctWa — Encrypted by Default</span>
        <span>·</span>
        <a href="https://github.com/m-tq/OctWa" target="_blank" rel="noopener">
          GitHub
        </a>
      </footer>

      {/* ─── Lightbox ─── */}
      {(currentPage === "main" || currentPage === "apps") && (
        <div
          className={`lightbox ${lightboxOpen ? "active" : ""}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <div className="lightbox-content">
            <button className="lightbox-close" onClick={closeLightbox}>
              <X size={24} />
            </button>
            <button className="lightbox-nav lightbox-prev" onClick={prevImage}>
              <ChevronLeft size={22} />
            </button>
            <img
              className="lightbox-img"
              src={currentLightbox.src}
              alt={currentLightbox.caption}
            />
            <button className="lightbox-nav lightbox-next" onClick={nextImage}>
              <ChevronRight size={22} />
            </button>
            <div className="lightbox-caption">{currentLightbox.caption}</div>
            <div className="lightbox-counter">
              {currentImageIndex + 1} / {activeLightboxImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
