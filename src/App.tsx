import { CSSProperties, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Github, Mail, Menu } from 'lucide-react';

const BG_IMAGE_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85';
const BG_IMAGE_2 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85';
const SPOTLIGHT_R = 260;

type Point = {
  x: number;
  y: number;
};

type RevealLayerProps = {
  image: string;
  cursorX: number;
  cursorY: number;
};

function RevealLayer({ image, cursorX, cursorY }: RevealLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [maskImage, setMaskImage] = useState('linear-gradient(transparent, transparent)');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = context.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)');
    gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)');
    gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    context.fill();

    setMaskImage(`url(${canvas.toDataURL()})`);
  }, [cursorX, cursorY]);

  const revealStyle: CSSProperties = {
    backgroundImage: `url(${image})`,
    maskImage,
    WebkitMaskImage: maskImage,
    maskSize: '100% 100%',
    WebkitMaskSize: '100% 100%'
  };

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ display: 'none' }} />
      <div className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none" style={revealStyle} />
    </>
  );
}

function LogoMark() {
  return (
    <span
      className="grid size-9 place-items-center rounded-full border border-white/30 bg-white/20 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(0,0,0,0.18)] backdrop-blur-md"
      aria-hidden="true"
    >
      LQ
    </span>
  );
}

export default function App() {
  const mouse = useRef<Point>({ x: -999, y: -999 });
  const smooth = useRef<Point>({ x: -999, y: -999 });
  const rafRef = useRef<number | null>(null);
  const [cursorPos, setCursorPos] = useState<Point>({ x: -999, y: -999 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
    };

    const updateCursor = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
      setCursorPos({ x: smooth.current.x, y: smooth.current.y });
      rafRef.current = window.requestAnimationFrame(updateCursor);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafRef.current = window.requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const navItems = [
    { label: '首页', href: '#top' },
    { label: '方向', href: '#focus' },
    { label: '项目', href: '#work' },
    { label: '联系', href: '#contact' }
  ];

  const focusItems = [
    {
      index: '01',
      title: '生成模型',
      copy: '关注文生图、去偏和模型行为，让想法落到可以复现实验的训练流程里。'
    },
    {
      index: '02',
      title: '研究工程',
      copy: '把论文阅读、实验脚本和结果记录整理成清晰、可追踪、能继续迭代的项目。'
    },
    {
      index: '03',
      title: '表达与工具',
      copy: '重视界面、文档和信息层级，让复杂主题更容易被理解、交流和复盘。'
    }
  ];

  const projects = [
    {
      label: 'Featured Project',
      title: 'Text-to-Image Debiasing',
      copy: '基于元学习思路的文生图去偏课程项目，包含 Meta UNet、SDXL 训练和测试脚本。',
      href: 'https://github.com/chilgod/text-to-image-debiasing'
    },
    {
      label: 'Research',
      title: '研究笔记与报告',
      copy: '持续整理论文阅读、课程报告和实验记录，保留从问题到结果的推理链路。',
      href: '#contact'
    },
    {
      label: 'GitHub Profile',
      title: '代码与公开仓库',
      copy: '浏览更多公开代码、实验项目和后续更新。',
      href: 'https://github.com/chilgod'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-[#171b18]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <nav className="fixed left-0 right-0 top-0 z-[100] flex items-center justify-between border-b border-white/10 bg-black/25 px-4 py-3 backdrop-blur-md sm:px-5">
        <a href="#top" className="flex items-center gap-2.5" aria-label="Letian Qi home">
          <LogoMark />
          <span className="text-lg font-semibold text-white sm:text-xl">Letian Qi</span>
        </a>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/30 bg-white/20 px-2 py-2 backdrop-blur-md md:flex">
          {navItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                index === 0 ? 'text-white bg-white/20' : 'text-white/80 hover:bg-white/20 hover:text-white'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        <a
          className="hidden items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-950 transition-colors hover:bg-gray-100 md:inline-flex"
          href="mailto:zl620186@gmail.com"
        >
          Email
          <Mail size={16} strokeWidth={2} />
        </a>

        <button className="md:hidden text-white p-2" type="button" aria-label="Open navigation">
          <Menu size={26} strokeWidth={2} />
        </button>
      </nav>

      <main id="top">
        <section className="relative w-full overflow-hidden bg-black" style={{ height: '100dvh' }}>
          <div
            className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom"
            style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
          />

          <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />

          <div className="absolute inset-0 z-40 bg-[linear-gradient(180deg,rgba(0,0,0,0.22)_0%,rgba(0,0,0,0.08)_34%,rgba(0,0,0,0.78)_100%)] pointer-events-none" />

          <div className="absolute left-0 right-0 top-[17%] z-50 flex flex-col items-center px-5 text-center pointer-events-none">
            <p
              className="hero-anim hero-fade mb-4 text-xs font-semibold uppercase text-white/70 sm:text-sm"
              style={{ animationDelay: '0.12s' }}
            >
              @chilgod
            </p>
            <h1 className="text-white leading-[0.92]" aria-label="Letian Qi">
              <span
                className="block font-playfair italic font-normal text-6xl sm:text-8xl md:text-9xl hero-anim hero-reveal"
                style={{ animationDelay: '0.25s' }}
              >
                Letian
              </span>
              <span
                className="block font-normal text-6xl sm:text-8xl md:text-9xl -mt-1 hero-anim hero-reveal"
                style={{ animationDelay: '0.42s' }}
              >
                Qi
              </span>
            </h1>
            <p
              className="hero-anim hero-fade mt-6 max-w-[760px] text-base font-medium text-white/80 sm:text-xl"
              style={{ animationDelay: '0.58s' }}
            >
              AI / 生成模型 / 研究型工程实践
            </p>
          </div>

          <div
            className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[285px] z-50 hero-anim hero-fade"
            style={{ animationDelay: '0.72s' }}
          >
            <p className="text-sm text-white/80 leading-relaxed">
              关注人工智能、生成模型与研究型工程实践，把论文想法推进到可复现的代码、实验和表达。
            </p>
          </div>

          <div
            className="absolute bottom-8 left-5 right-5 z-50 flex max-w-full flex-col items-start gap-4 sm:bottom-20 sm:left-auto sm:right-10 sm:max-w-[315px] sm:gap-5 md:right-14 hero-anim hero-fade"
            style={{ animationDelay: '0.88s' }}
          >
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              我喜欢把复杂问题拆成可验证的实验、清晰的工具和能被继续讨论的材料。
            </p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <a
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e8702a] px-7 py-3 text-sm font-medium text-white transition-all hover:scale-[1.03] hover:bg-[#d2611f] hover:shadow-lg hover:shadow-[#e8702a]/30 active:scale-95"
                href="https://github.com/chilgod"
              >
                GitHub
                <Github size={17} strokeWidth={2} />
              </a>
              <a
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
                href="mailto:zl620186@gmail.com"
              >
                Email
                <Mail size={17} strokeWidth={2} />
              </a>
            </div>
          </div>
        </section>

        <section id="focus" className="border-b border-[#d8ddd2] bg-[#eef2e9] px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
          <div className="mx-auto w-full max-w-6xl">
            <p className="mb-3 text-xs font-extrabold uppercase text-[#b76135] sm:text-sm">Focus</p>
            <h2 className="max-w-3xl text-4xl font-semibold leading-none text-[#171b18] sm:text-5xl lg:text-6xl">
              近期关注
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {focusItems.map((item) => (
                <article
                  key={item.index}
                  className="min-h-[220px] rounded-lg border border-[#31523b]/20 bg-white/70 p-6 shadow-[0_1px_0_rgba(24,32,27,0.04)]"
                >
                  <span className="text-sm font-extrabold text-[#68476c]">{item.index}</span>
                  <h3 className="mt-8 text-xl font-semibold text-[#171b18]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#5e665f]">{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="bg-[#f6f4ef] px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
          <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <p className="mb-3 text-xs font-extrabold uppercase text-[#b76135] sm:text-sm">Work</p>
              <h2 className="max-w-xl text-4xl font-semibold leading-none text-[#171b18] sm:text-5xl lg:text-6xl">
                项目入口
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-[#5e665f]">
                这里先放公开项目、研究材料和 GitHub 入口，后续可以继续扩展成博客、简历或论文页面。
              </p>
            </div>
            <div className="grid gap-3">
              {projects.map((project, index) => (
                <a
                  key={project.title}
                  className={`group grid min-h-[118px] gap-2 rounded-lg border p-5 text-left no-underline transition-all hover:-translate-y-0.5 hover:border-[#b76135]/50 hover:shadow-[0_18px_50px_rgba(24,32,27,0.14)] ${
                    index === 0
                      ? 'border-[#31523b]/30 bg-gradient-to-br from-white to-[#f2f6ed]'
                      : 'border-[#d8ddd2] bg-white'
                  }`}
                  href={project.href}
                >
                  <span className="text-xs font-extrabold uppercase text-[#b76135]">{project.label}</span>
                  <span className="flex items-center justify-between gap-4 text-xl font-semibold text-[#171b18]">
                    {project.title}
                    <ArrowUpRight
                      className="shrink-0 text-[#5e665f] transition-colors group-hover:text-[#b76135]"
                      size={20}
                      strokeWidth={2}
                    />
                  </span>
                  <p className="m-0 max-w-2xl text-sm leading-relaxed text-[#5e665f]">{project.copy}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-[#171b18] px-5 py-20 text-white sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-xs font-extrabold uppercase text-[#d99668] sm:text-sm">Contact</p>
              <h2 className="text-4xl font-semibold leading-none sm:text-5xl lg:text-6xl">保持联系</h2>
            </div>
            <div className="grid w-full gap-2 md:w-[360px]">
              <a
                className="flex items-center justify-between gap-4 border-b border-white/20 py-4 text-white/80 transition-colors hover:text-white"
                href="mailto:zl620186@gmail.com"
              >
                zl620186@gmail.com
                <Mail size={18} strokeWidth={2} />
              </a>
              <a
                className="flex items-center justify-between gap-4 border-b border-white/20 py-4 text-white/80 transition-colors hover:text-white"
                href="https://github.com/chilgod"
              >
                github.com/chilgod
                <Github size={18} strokeWidth={2} />
              </a>
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-2 bg-[#f6f4ef] px-5 py-7 text-sm text-[#5e665f] sm:flex-row sm:justify-between sm:px-8 lg:px-14">
          <span>© 2026 Letian Qi</span>
          <span>Built for GitHub Pages</span>
        </footer>
      </main>
    </div>
  );
}
