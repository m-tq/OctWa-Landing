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
  Coins,
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
    name: "OctWa dApp Starter",
    description:
      "A comprehensive demonstration of the complete Octra blockchain ecosystem integration.",
    appUrl: "https://starter.octwa.pw/",
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
  {
    name: "OctWa Bridge",
    description:
      "Cross-chain bridge for OCT and wOCT. Lock OCT on Octra to mint wOCT on Ethereum, or burn wOCT to unlock OCT.",
    appUrl: "https://bridge.octwa.pw/",
    repoUrl: "https://github.com/m-tq/OctWa-Bridge",
    screenshotUrl: "bridge.png",
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 64 64" fill="none">
        <rect x="4" y="28" width="56" height="8" rx="4" fill="currentColor" opacity="0.3"/>
        <rect x="8" y="20" width="8" height="24" rx="2" fill="currentColor"/>
        <rect x="48" y="20" width="8" height="24" rx="2" fill="currentColor"/>
        <path d="M20 32 L44 32" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M38 26 L44 32 L38 38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
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
  BookOpen,    // Overview
  ArrowDown,   // Installation
  Code,        // Quick Start
  Layers,      // Core Concepts
  Wallet,      // Balance & Sign
  Globe,       // EVM Operations
  Lock,        // Private Balance
  ArrowDown,   // Stealth Transfers
  Zap,         // Contract Calls
  Coins,       // EVM Token Balances
  Zap,         // Gas Estimation
  Globe,       // Events
  Key,         // Crypto Utilities
  ShieldCheck, // Security
  Shield,      // Error Handling
  Code,        // TypeScript Types
];

type CodeSample = { title: string; code: string };
type SdkSection = {
  id: string;
  title: string;
  description: ReactNode;
  bullets?: ReactNode[];
  samples?: CodeSample[];
  actions?: ReactNode;
};

const sdkSections: SdkSection[] = [
  {
    id: "overview",
    title: "@octwa/sdk v1.3.4",
    description:
      "Official TypeScript SDK for integrating dApps with the OctWa Wallet Extension. Capability-based authorization, real SHA-256 via Web Crypto API, canonical serialization, domain separation, signing mutex, and full HFHE support. Private keys never leave the extension.",
    bullets: [
      <>SDK is stateless — never holds private keys. All signing happens inside the wallet extension.</>,
      <>All data flows: dApp → SDK → window.octra → content.js → background.js → Octra Node RPC.</>,
      <>Capability-based authorization: scoped, time-bound, origin-bound permission tokens (Ed25519 signed).</>,
      <>Real SHA-256 via <code className="sdk-inline-code">crypto.subtle</code> — no custom hash for security ops.</>,
      <>Signing mutex serializes concurrent <code className="sdk-inline-code">invoke()</code> calls — prevents nonce races.</>,
      <>Networks: <code className="sdk-inline-code">mainnet</code> and <code className="sdk-inline-code">devnet</code>. EVM network auto-resolved from wallet settings.</>,
    ],
  },
  {
    id: "installation",
    title: "Installation",
    description: "Install via npm. Supports CJS and ESM. Full TypeScript types included.",
    samples: [
      {
        title: "Install",
        code: `npm install @octwa/sdk@1.3.4`,
      },
      {
        title: "Import",
        code: `import { OctraSDK } from '@octwa/sdk';
import type {
  Connection, Capability, BalanceResponse,
  SignMessageResult, EncryptedBalanceInfo,
  GetEvmTokensResult, Erc20TokenBalance,
} from '@octwa/sdk';`,
      },
    ],
  },
  {
    id: "quickstart",
    title: "Quick Start",
    description: "Initialize, connect, request a capability, and fetch balance — all in a few lines.",
    samples: [
      {
        title: "Complete integration example",
        code: `import { OctraSDK } from '@octwa/sdk';

// 1. Initialize — detects window.octra via octraLoaded + octra:announceProvider
const sdk = await OctraSDK.init({ timeout: 3000 });

if (!sdk.isInstalled()) {
  console.log('Please install OctWa Wallet extension');
  return;
}

// 2. Connect — returns walletPubKey, evmAddress, evmNetworkId, epoch, branchId
const connection = await sdk.connect({
  circle: 'my_dapp_v1',
  appOrigin: window.location.origin,
  appName: 'My dApp',
});
console.log('Octra address:', connection.walletPubKey);
console.log('EVM address:',   connection.evmAddress);
console.log('EVM network:',   connection.evmNetworkId); // e.g. 'eth-mainnet'
console.log('Network:',       connection.network);      // 'mainnet' | 'devnet'

// 3. Request read capability
const cap = await sdk.requestCapability({
  circle: 'my_dapp_v1',
  methods: ['get_balance'],
  scope: 'read',
  encrypted: false,
  ttlSeconds: 3600,
});

// 4. Get balance — auto-execute, no popup
const balance = await sdk.getBalance(cap.id);
console.log('OCT balance:', balance.octBalance, 'OCT');
console.log('Encrypted:',  balance.encryptedBalance, 'OCT');
console.log('Network:',    balance.network);`,
      },
    ],
  },
  {
    id: "core-concepts",
    title: "Core Concepts",
    description: "Circles, capabilities, invocations, and the capability-based authorization model.",
    bullets: [
      <>
        <strong>Circle:</strong> A named authorization scope — like an OAuth client ID. Use a stable, unique identifier per dApp (e.g. <code className="sdk-inline-code">'my_dapp_v1'</code>).
      </>,
      <>
        <strong>Capability:</strong> A cryptographically signed permission token (Ed25519) issued by the wallet. Scoped to specific methods, time-bound (<code className="sdk-inline-code">ttlSeconds</code>), and origin-bound (<code className="sdk-inline-code">appOrigin</code>).
      </>,
      <>
        <strong>Invocation:</strong> A <code className="sdk-inline-code">SignedInvocation</code> built by the SDK with monotonic nonce, domain-separated origin hash, and payload hash. Wallet validates all fields before signing.
      </>,
      <>
        <strong>Auto-execute vs popup:</strong> <code className="sdk-inline-code">read</code> scope methods execute automatically (no popup). <code className="sdk-inline-code">write</code> scope always opens a popup for user approval.
      </>,
      <>
        <strong>Network:</strong> Octra has <code className="sdk-inline-code">mainnet</code> and <code className="sdk-inline-code">devnet</code>. EVM network (<code className="sdk-inline-code">evmNetworkId</code>) is auto-resolved from wallet settings — dApp does not specify it.
      </>,
    ],
    samples: [
      {
        title: "Connection object",
        code: `interface Connection {
  circle:       string;
  sessionId:    string;
  walletPubKey: string;          // Octra address
  evmAddress:   string;          // Ethereum address (derived from same key)
  evmNetworkId: string;          // e.g. 'eth-mainnet', 'base-mainnet'
  network:      'mainnet' | 'devnet';
  epoch:        number;
  branchId:     string;
}`,
      },
      {
        title: "Capability type (v2)",
        code: `interface Capability {
  id:           string;
  version:      2;
  circle:       string;
  methods:      readonly string[];
  scope:        'read' | 'write' | 'compute';
  encrypted:    boolean;
  appOrigin:    string;    // cryptographically bound
  branchId:     string;
  epoch:        number;
  issuedAt:     number;
  expiresAt:    number;
  nonceBase:    number;
  walletPubKey: string;    // hex Ed25519 public key
  signature:    string;    // Ed25519 signature
  state:        'ACTIVE' | 'EXPIRED' | 'REVOKED';
  lastNonce:    number;
}`,
      },
    ],
  },
  {
    id: "balance-sign",
    title: "Balance & Sign Message",
    description: "Fetch full balance (public + encrypted) and sign messages for authentication flows.",
    samples: [
      {
        title: "getBalance() — auto-execute, read scope",
        code: `// Requires: get_balance, read scope
const balance = await sdk.getBalance(capabilityId);

// BalanceResponse
// balance.octAddress      — Octra address
// balance.octBalance      — public OCT balance
// balance.encryptedBalance — decrypted encrypted balance (0 if PVAC unavailable)
// balance.cipher          — raw HFHE cipher string
// balance.hasPvacPubkey   — whether FHE public key is registered
// balance.network         — 'mainnet' | 'devnet'
console.log(balance.octBalance, 'OCT public');
console.log(balance.encryptedBalance, 'OCT encrypted');`,
      },
      {
        title: "signMessage() — popup, no capability needed",
        code: `// Always opens popup for user approval
// Use case: "Sign in with Octra" authentication
const result = await sdk.signMessage('Sign in to My dApp');

// SignMessageResult
// result.signature — Ed25519 hex signature
// result.message   — original message
// result.address   — Octra address that signed
console.log('Signed by:', result.address);
console.log('Signature:', result.signature);`,
      },
    ],
  },
  {
    id: "evm-operations",
    title: "EVM Operations",
    description: "Send ETH and ERC-20 transactions using the wallet's derived secp256k1 key. Network auto-resolved from wallet settings.",
    bullets: [
      <>Network defaults to wallet's active EVM network (<code className="sdk-inline-code">connection.evmNetworkId</code>) — dApp does not need to specify it.</>,
      <>Wallet derives the Ethereum address from the same seed as the Octra address — one key pair, two chains.</>,
    ],
    samples: [
      {
        title: "sendEvmTransaction() — popup, write scope",
        code: `// Requires: send_evm_transaction, write scope
const result = await sdk.sendEvmTransaction(capabilityId, {
  to:     '0x...',
  amount: '0.01',   // ETH as decimal string
  data:   '0x...',  // optional calldata
  // network: 'eth-mainnet'  ← optional, defaults to wallet's active EVM network
});
// result.txHash, result.network`,
      },
      {
        title: "sendErc20Transaction() — popup, write scope",
        code: `// Requires: send_erc20_transaction, write scope
const result = await sdk.sendErc20Transaction(capabilityId, {
  tokenContract: '0x4647e1fE715c9e23959022C2416C71867F5a6E80', // wOCT
  to:       '0x...',
  amount:   '1000000',  // raw units (6 decimals for wOCT)
  decimals: 6,
  symbol:   'wOCT',
  // network: 'eth-mainnet'  ← optional
});
// result.txHash, result.network`,
      },
    ],
  },
  {
    id: "private-balance",
    title: "Private Balance",
    description: "Move OCT between public and encrypted balance using HFHE (Homomorphic FHE). Requires PVAC server configured in wallet settings.",
    bullets: [
      <>All HFHE proof generation happens inside the wallet — dApp only sends amounts.</>,
      <>PVAC server is wallet-owned — dApp never handles raw ciphertexts.</>,
    ],
    samples: [
      {
        title: "getEncryptedBalance() — auto-execute, read scope",
        code: `// Requires: get_encrypted_balance, read scope
const info = await sdk.getEncryptedBalance(capabilityId);
// info.encryptedBalance — decrypted amount in OCT
// info.cipher           — raw HFHE cipher string
// info.hasPvacPubkey    — whether FHE public key is registered`,
      },
      {
        title: "encryptBalance() / decryptBalance() — popup, write scope",
        code: `// Move OCT → encrypted balance — popup
const enc = await sdk.encryptBalance(capabilityId, 1.0);
// enc.txHash, enc.amount

// Move encrypted balance → OCT — popup
const dec = await sdk.decryptBalance(capabilityId, 0.5);
// dec.txHash, dec.amount`,
      },
    ],
  },
  {
    id: "stealth-transfers",
    title: "Stealth Transfers",
    description: "Private transfers from encrypted balance. Recipient must have a registered view public key.",
    bullets: [
      <>Wallet's private view key is used internally for scanning — never exposed to dApp.</>,
      <>Stealth outputs are claimable by the recipient and added to their encrypted balance.</>,
    ],
    samples: [
      {
        title: "stealthSend() / stealthScan() / stealthClaim()",
        code: `// Send private transfer from encrypted balance — popup
const sent = await sdk.stealthSend(capabilityId, {
  to:     'oct...',  // recipient Octra address
  amount: 0.5,       // OCT from encrypted balance
});
// sent.txHash, sent.amount

// Scan for claimable outputs — auto-execute, no popup
// Uses wallet's private view key internally
const outputs = await sdk.stealthScan(capabilityId);
// outputs[].id, .amount, .sender, .epoch, .txHash

// Claim a stealth output into encrypted balance — popup
const claimed = await sdk.stealthClaim(capabilityId, outputs[0].id);
// claimed.txHash, claimed.amount, claimed.outputId`,
      },
    ],
  },
  {
    id: "contract-calls",
    title: "Contract Calls",
    description: "Send typed Octra contract call transactions via the SDK convenience method.",
    samples: [
      {
        title: "sendContractCall() — popup, write scope",
        code: `// Requires: send_transaction, write scope
const result = await sdk.sendContractCall(capabilityId, {
  contract: 'oct...',          // contract address
  method:   'transfer',        // method name
  params:   ['oct...', 1000],  // method parameters
  amount:   0,                 // OCT to attach (default 0)
  ou:       1000,              // optional fee in OU
});
// result.txHash, result.contract, result.method`,
      },
    ],
  },
  {
    id: "evm-tokens",
    title: "EVM Token Balances",
    description: "Fetch all ERC-20 token balances for the wallet's active EVM network, or query a specific token.",
    samples: [
      {
        title: "getEvmTokens() — auto-execute, read scope",
        code: `// Requires: get_evm_tokens, read scope
const result = await sdk.getEvmTokens(capabilityId);
// result.tokens    — Erc20TokenBalance[]
// result.networkId — active EVM network ID, e.g. 'eth-mainnet'
// result.chainId   — EVM chain ID, e.g. 1

for (const token of result.tokens) {
  console.log(token.symbol, token.balance, token.address);
}`,
      },
      {
        title: "getEvmTokenBalance() — auto-execute, read scope",
        code: `// Requires: get_evm_token_balance, read scope
const wOCT = await sdk.getEvmTokenBalance(
  capabilityId,
  '0x4647e1fE715c9e23959022C2416C71867F5a6E80',
  { decimals: 6, symbol: 'wOCT', name: 'Wrapped OCT' },
);
// wOCT.balance, wOCT.symbol, wOCT.decimals, wOCT.chainId`,
      },
    ],
  },
  {
    id: "gas-estimation",
    title: "Gas Estimation",
    description:
      "Estimate fees live from the node via octra_recommendedFee. All data flows through the wallet — dApp never calls RPC directly.",
    samples: [
      {
        title: "Live fee estimates",
        code: `const standard = await sdk.estimatePlainTx({});
// standard.gasUnits     — fee in OU
// standard.tokenCost    — fee in OCT
// standard.epoch        — current epoch

const encrypted = await sdk.estimateEncryptedTx({
  scheme: 'HFHE',
  data: new Uint8Array(8),
  associatedData: 'metadata',
});

// Formula: OU ÷ 1,000,000 = fee in OCT
console.log(standard.gasUnits, 'OU =', standard.tokenCost, 'OCT');`,
      },
    ],
  },
  {
    id: "events",
    title: "Events",
    description: "Subscribe to real-time events for connection and capability changes.",
    samples: [
      {
        title: "Event listeners",
        code: `// Returns unsubscribe function
const off = sdk.on('connect', ({ connection }) => {
  console.log('Connected:', connection.walletPubKey);
  console.log('EVM network:', connection.evmNetworkId);
});

sdk.on('disconnect', () => console.log('Disconnected'));

sdk.on('capabilityGranted', ({ capability }) => {
  console.log('Granted:', capability.id, capability.scope);
});

sdk.on('capabilityRevoked', ({ capabilityId }) => {
  console.log('Revoked:', capabilityId);
});

sdk.on('branchChanged', ({ branchId, epoch }) => {
  console.log('Branch:', branchId, 'Epoch:', epoch);
});

sdk.on('epochChanged', ({ epoch }) => {
  console.log('New epoch:', epoch);
});

sdk.on('extensionReady', () => {
  console.log('OctWa extension detected');
});

sdk.on('balanceChanged', ({ octBalance }) => {
  console.log('Balance changed:', octBalance);
});

sdk.on('encryptedBalanceChanged', (info) => {
  console.log('Encrypted balance changed:', info.encryptedBalance);
});

off(); // unsubscribe`,
      },
    ],
  },
  {
    id: "crypto-utils",
    title: "Cryptographic Utilities",
    description:
      "Exported crypto and canonical serialization utilities — all using real SHA-256 via Web Crypto API.",
    bullets: [
      <><code className="sdk-inline-code">canonicalize(obj)</code> — deterministic JSON, keys sorted lexicographically</>,
      <><code className="sdk-inline-code">hashCapabilityWithDomain(payload)</code> — SHA-256(OctraCapability:v2: + canonical) — async</>,
      <><code className="sdk-inline-code">sha256Bytes(data)</code> — real SHA-256 via crypto.subtle — async</>,
      <><code className="sdk-inline-code">bytesToHex(bytes) / hexToBytes(hex)</code> — encoding utilities</>,
      <><code className="sdk-inline-code">verifyEd25519Signature(sig, msg, pubkey)</code> — Ed25519 verify (Web Crypto + tweetnacl fallback)</>,
      <><code className="sdk-inline-code">verifyCapabilitySignature(cap)</code> — full capability signature verification</>,
      <><code className="sdk-inline-code">generateNonce()</code> — CSPRNG UUID-format nonce</>,
      <><code className="sdk-inline-code">decodeResponseData&lt;T&gt;(result)</code> — unwrap nested {"{success,data}"} + Uint8Array → JSON</>,
      <><code className="sdk-inline-code">decodeBalanceResponse(result)</code> — typed decode → BalanceResponse</>,
    ],
    samples: [
      {
        title: "Canonical serialization & domain separation",
        code: `import {
  canonicalize,
  sha256String,
  OCTRA_CAPABILITY_PREFIX,
  OCTRA_INVOCATION_PREFIX,
  decodeResponseData,
  decodeBalanceResponse,
} from '@octwa/sdk';

// Deterministic JSON — keys sorted
canonicalize({ b: 2, a: 1 });
// → '{"a":1,"b":2}'

// Real SHA-256 (async)
const hash = await sha256String('hello');
// → 'b94d27b9...' (64 hex chars)

// Domain separation constants
console.log(OCTRA_CAPABILITY_PREFIX);  // 'OctraCapability:v2:'
console.log(OCTRA_INVOCATION_PREFIX);  // 'OctraInvocation:v2:'

// Decode raw invoke result
const balance = decodeBalanceResponse(result);`,
      },
    ],
  },
  {
    id: "security",
    title: "Security Architecture",
    description:
      "Built-in security mechanisms protecting users and ensuring transaction integrity.",
    bullets: [
      <>
        <strong>Real SHA-256:</strong> <code className="sdk-inline-code">crypto.subtle.digest</code> — no djb2 or custom hash for security-critical operations.
      </>,
      <>
        <strong>Domain separation:</strong> <code className="sdk-inline-code">OctraCapability:v2:</code> and <code className="sdk-inline-code">OctraInvocation:v2:</code> prefixes prevent cross-context signature replay.
      </>,
      <>
        <strong>Signing mutex:</strong> Serializes concurrent <code className="sdk-inline-code">invoke()</code> calls — prevents nonce races and double-send attacks.
      </>,
      <>
        <strong>Nonce monotonicity:</strong> SDK tracks nonces locally; wallet is final authority and rejects violations.
      </>,
      <>
        <strong>Origin binding:</strong> Capabilities cryptographically bound to <code className="sdk-inline-code">appOrigin</code> — cannot be used cross-origin.
      </>,
      <>
        <strong>Private key isolation:</strong> Keys live only in background.js service worker — never in SDK or dApp context.
      </>,
      <>
        <strong>PVAC server isolation:</strong> HFHE proof generation happens inside the wallet — dApps never handle raw ciphertexts.
      </>,
      <>
        <strong>Network ownership:</strong> <code className="sdk-inline-code">connection.network</code> (Octra) and <code className="sdk-inline-code">connection.evmNetworkId</code> (EVM) are read from wallet settings — dApp cannot override.
      </>,
    ],
  },
  {
    id: "error-handling",
    title: "Error Handling",
    description: "Typed error classes for precise error handling in every scenario.",
    samples: [
      {
        title: "Error handling",
        code: `import {
  NotInstalledError,
  NotConnectedError,
  UserRejectedError,
  TimeoutError,
  CapabilityExpiredError,
  ScopeViolationError,
  ValidationError,
} from '@octwa/sdk';

try {
  await sdk.encryptBalance(capabilityId, 1.0);
} catch (error) {
  if (error instanceof UserRejectedError) {
    return; // user cancelled — no error UI needed
  }
  if (error instanceof CapabilityExpiredError) {
    const renewed = await sdk.renewCapability(capabilityId);
    // retry with renewed.id
  }
  if (error instanceof ScopeViolationError) {
    console.error('Method not in capability scope:', error.message);
  }
  if (error instanceof ValidationError) {
    console.error('Invalid input:', error.message);
  }
  if (error instanceof NotConnectedError) {
    await sdk.connect({ circle: 'my_circle', appOrigin: origin });
  }
}`,
      },
    ],
  },
  {
    id: "typescript-types",
    title: "TypeScript Types",
    description: "Full TypeScript support — all types exported from the package.",
    samples: [
      {
        title: "Type imports",
        code: `import type {
  // Connect
  ConnectRequest, Connection,
  // Capabilities
  CapabilityScope, CapabilityState,
  CapabilityRequest, CapabilityPayload, Capability,
  // Invocations
  InvocationRequest, InvocationResult,
  SignedInvocation, InvocationHeader, InvocationBody,
  // Encryption
  EncryptedPayload, EncryptedBlob,
  // Gas
  GasEstimate,
  // Session
  SessionState,
  // Balance
  BalanceResponse,
  // Sign Message (Phase 1)
  SignMessageResult,
  // EVM Operations (Phase 3)
  EvmTransactionPayload, EvmTransactionResult, Erc20TransactionPayload,
  // Encrypted Balance (Phase 4)
  EncryptedBalanceInfo, EncryptBalanceResult, DecryptBalanceResult,
  // Stealth Transfers (Phase 5)
  ClaimableOutput, StealthSendPayload, StealthSendResult, StealthClaimResult,
  // Contract Interactions (Phase 6)
  ContractCallPayload, ContractCallResult,
  // EVM Token Balances (Phase 9)
  Erc20TokenBalance, GetEvmTokensResult,
  // Config
  InitOptions,
  // Events
  EventName, EventCallback,
  // Errors
  ErrorCode,
  // Provider
  OctraProvider,
} from '@octwa/sdk';`,
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
        vec3 color1 = vec3(0.231, 0.337, 0.498);
        vec3 color2 = vec3(0.318, 0.431, 0.604);
        vec3 color3 = vec3(0.549, 0.616, 0.714);
        vec3 color4 = vec3(0.165, 0.247, 0.373);
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
        vec3 color = vec3(0.231, 0.337, 0.498);
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
        case "sdk": {
          // Scroll to section anchor in docs page
          const section = visibleSdkSections[index];
          if (section) {
            const el = document.getElementById(`sdk-section-${section.id}`);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }
          setCurrentSdkSlide(index);
          break;
        }
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
    [currentPage, goToSlide, goToAppSlide, goToToolSlide, visibleSdkSections],
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

  // Scroll spy — ref callback attaches listener the moment the element mounts
  const sdkScrollRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (!el) return;

      const sectionEls = visibleSdkSections
        .map((s) => document.getElementById(`sdk-section-${s.id}`))
        .filter(Boolean) as HTMLElement[];

      let rafId: number | null = null;

      const updateActive = () => {
        const containerRect = el.getBoundingClientRect();
        const triggerY = containerRect.top + containerRect.height * 0.35;

        let activeIdx = 0;
        for (let i = 0; i < sectionEls.length; i++) {
          const rect = sectionEls[i].getBoundingClientRect();
          if (rect.top <= triggerY) {
            activeIdx = i;
          } else {
            break;
          }
        }

        setCurrentSdkSlide(activeIdx);
        currentSdkSlideRef.current = activeIdx;
      };

      const onScroll = () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(updateActive);
      };

      updateActive();
      el.addEventListener("scroll", onScroll, { passive: true });
    },
    [visibleSdkSections],
  );

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

            {/* ════════════ SDK PAGE — docs-style scrollable ════════════ */}
            {currentPage === "sdk" && (
              <motion.div
                key="sdk"
                className="page-transition sdk-docs-page"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="sdk-docs-scroll" id="sdk-docs-scroll" ref={sdkScrollRef}>
                  {/* Header */}
                  <div className="sdk-docs-header">
                    <div className="sdk-docs-badge">@octwa/sdk</div>
                    <h1 className="sdk-docs-title">SDK Documentation</h1>
                    <p className="sdk-docs-subtitle">
                      v1.3.4 · TypeScript · CJS + ESM · MIT License
                    </p>
                    <div className="cta-group" style={{ justifyContent: "flex-start", marginTop: "1rem" }}>
                      <a className="btn btn-primary" href="https://www.npmjs.com/package/@octwa/sdk" target="_blank" rel="noopener">
                        <ExternalLink size={14} /> npm install @octwa/sdk
                      </a>
                      <a className="btn btn-secondary" href="https://github.com/m-tq/OctWa/tree/master/main/sdk" target="_blank" rel="noopener">
                        <Github size={14} /> GitHub
                      </a>
                    </div>
                  </div>

                  {/* All sections rendered inline */}
                  {visibleSdkSections.map((section, si) => (
                    <section
                      key={section.id}
                      id={`sdk-section-${section.id}`}
                      className="sdk-docs-section"
                    >
                      <h2 className="sdk-docs-section-title">{section.title}</h2>
                      <p className="sdk-docs-section-desc">{section.description}</p>

                      {section.actions && (
                        <div className="sdk-docs-actions">{section.actions}</div>
                      )}

                      {section.bullets && (
                        <ul className="sdk-docs-list">
                          {section.bullets.map((bullet, bi) => (
                            <li key={`${section.id}-b-${bi}`}>{bullet}</li>
                          ))}
                        </ul>
                      )}

                      {section.samples?.map((sample, sampleIdx) => {
                        const blockId = `${si}-${sampleIdx}`;
                        return (
                          <CodeBlock
                            key={`${section.id}-${sample.title}`}
                            sample={sample}
                            blockId={blockId}
                            isCopied={copiedId === blockId}
                            onCopy={handleCopy}
                          />
                        );
                      })}
                    </section>
                  ))}

                  <div className="sdk-docs-footer">
                    <span>@octwa/sdk v1.3.4 · MIT License</span>
                    <a href="https://github.com/m-tq/OctWa" target="_blank" rel="noopener">
                      <Github size={13} /> github.com/m-tq/OctWa
                    </a>
                  </div>
                </div>
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
