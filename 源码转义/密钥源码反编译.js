(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([[3952], {
    21226: function(e, t, i) {
        "use strict";
        var n, o = i(2602);
        function a() {
            return (a = Object.assign ? Object.assign.bind() : function(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var i = arguments[t];
                    for (var n in i)
                        ({}).hasOwnProperty.call(i, n) && (e[n] = i[n])
                }
                return e
            }
            ).apply(null, arguments)
        }
        t.Z = function(e) {
            return o.createElement("svg", a({
                viewBox: "0 0 18 18",
                fill: "none"
            }, e), n || (n = o.createElement("path", {
                d: "M.6 7.872h13.344L7.296 1.68 8.808.144 17.4 8.352v1.32l-8.592 8.184-1.512-1.536 6.696-6.24H.6z",
                fill: "currentColor"
            })))
        }
    },
    51319: function(e, t, i) {
        Promise.resolve().then(i.bind(i, 83155)),
        Promise.resolve().then(i.bind(i, 74281)),
        Promise.resolve().then(i.bind(i, 49236)),
        Promise.resolve().then(i.bind(i, 19714)),
        Promise.resolve().then(i.bind(i, 99854)),
        Promise.resolve().then(i.bind(i, 62355)),
        Promise.resolve().then(i.bind(i, 401)),
        Promise.resolve().then(i.bind(i, 71707))
    },
    51953: function(e, t, i) {
        "use strict";
        i.d(t, {
            H: function() {
                return y
            }
        });
        var n = i(11183)
          , o = i(11178)
          , a = i(97570)
          , l = i(43289)
          , s = i(40912)
          , r = i(51046)
          , c = i(50017)
          , d = i(59173)
          , p = i(58095)
          , u = i(28107)
          , m = i(38492)
          , h = i(88498)
          , g = i(82583)
          , x = i(84694)
          , f = i(24244)
          , v = i(62924);
        let b = e => {
            let t = (0,
            u.c)(0)
              , {scrollY: i} = (0,
            m.v)()
              , a = (0,
            h.T)(i)
              , l = (0,
            g.q)(a, {
                damping: 50,
                stiffness: 400
            })
              , s = (0,
            x.H)(l, [0, 1e3], [0, 0], {
                clamp: !1
            })
              , [[r,c],d] = (0,
            o.useState)([0, 0])
              , v = (0,
            o.useRef)(0)
              , b = (0,
            x.H)(t, e => "".concat((0,
            p.r)(-r, 0, e - v.current), "px"))
              , y = (0,
            o.useRef)(1);
            (0,
            f.p)( (i, n) => {
                if (!e.isInView)
                    return;
                let o = y.current * e.baseVelocity * (n / 1e3);
                o += o * y.current * s.get(),
                t.set(t.get() + o)
            }
            );
            let C = (0,
            o.useRef)(null);
            (0,
            o.useEffect)( () => {
                let t;
                let i = C.current;
                if (!i || !e.isInView || e.onlySingle)
                    return () => {
                        v.current = 0
                    }
                    ;
                let n = new ResizeObserver( () => void (i && (clearTimeout(t),
                t = setTimeout( () => {
                    d([i.offsetWidth, (null == i ? void 0 : i.parentNode).offsetWidth])
                }
                , 200))));
                return n.observe(i),
                () => {
                    n.unobserve(i),
                    clearTimeout(t)
                }
            }
            , [e.isInView, e.onlySingle]);
            let[I,A] = (0,
            o.useState)(!1);
            return (0,
            o.useEffect)( () => {
                let t = e.container.current;
                if (!t || !e.isInView)
                    return;
                let i = !1
                  , n = 0
                  , o = v.current
                  , a = e => {
                    i = !0,
                    A(!0),
                    n = o + e
                }
                  , l = () => {
                    i = !1,
                    A(!1)
                }
                  , s = e => {
                    i && ((o = n - e) > v.current ? y.current = -1 : o < v.current && (y.current = 1),
                    v.current = o)
                }
                  , r = e => {
                    a(e.clientX)
                }
                  , c = e => {
                    e.preventDefault(),
                    s(e.clientX)
                }
                  , d = e => {
                    e.touches[0] && a(e.touches[0].clientX)
                }
                  , p = e => {
                    e.preventDefault(),
                    e.touches[0] && s(e.touches[0].clientX)
                }
                ;
                return t.addEventListener("mousedown", r),
                t.addEventListener("mousemove", c),
                window.addEventListener("mouseup", l),
                t.addEventListener("mouseleave", l),
                t.addEventListener("touchstart", d),
                t.addEventListener("touchmove", p),
                t.addEventListener("touchend", l),
                () => {
                    t.removeEventListener("mousedown", r),
                    t.removeEventListener("mousemove", c),
                    window.removeEventListener("mouseup", l),
                    t.removeEventListener("mouseleave", l),
                    t.removeEventListener("touchstart", d),
                    t.removeEventListener("touchmove", p),
                    t.removeEventListener("touchend", l)
                }
            }
            , [e]),
            (0,
            n.jsx)(n.Fragment, {
                children: (0,
                n.jsxs)(j, {
                    className: "icons-carousel-row-content-container",
                    style: {
                        x: b
                    },
                    $isGrabbing: I,
                    $isOnlySingle: e.onlySingle,
                    children: [(0,
                    n.jsx)(w, {
                        className: "row-content-container-child-container1",
                        ref: C,
                        children: e.children
                    }), !e.onlySingle && (0,
                    n.jsxs)(n.Fragment, {
                        children: [(0,
                        n.jsx)(w, {
                            children: e.children
                        }), c > 0 && r > 0 && Array(Math.ceil(c / r) + 1).fill("").map( (t, i) => (0,
                        n.jsx)(w, {
                            children: e.children
                        }, "carousel-".concat(e.id, "-").concat(i)))]
                    })]
                })
            })
        }
          , w = d.default.div.withConfig({
            componentId: "sc-4d46ce3f-0"
        })(["display:flex;height:100%;flex-shrink:0;", " ", " > *{flex-shrink:0;width:auto;height:100%;}"], (0,
        c.zD)("gap", 24, 72, 80), (0,
        c.zD)("padding-right", 24, 72, 80))
          , j = (0,
        d.default)(v.E.div).withConfig({
            componentId: "sc-4d46ce3f-1"
        })(["display:flex;cursor:", ";"], e => e.$isOnlySingle ? "" : e.$isGrabbing ? "grabbing" : "grab")
          , y = e => {
            let {medias: t, spaceBottom: i, onlySingle: c} = e
              , d = (0,
            o.useRef)(null)
              , {ref: p, inView: u} = (0,
            a.YD)({
                threshold: 0
            });
            return (0,
            n.jsx)(s.Container, {
                className: "icons-carousel-inner",
                ref: p,
                $spaceTop: r.c6.small,
                $spaceBottom: i || r.c6.large,
                $layoutWidth: c ? r.c6.regular : void 0,
                children: (0,
                n.jsx)(C, {
                    ref: d,
                    children: (0,
                    n.jsx)(b, {
                        baseVelocity: 60,
                        isInView: u,
                        id: "logo-carousel",
                        container: d,
                        onlySingle: c,
                        children: t && t.filter(e => !!e).map( (e, t) => {
                            let i = e.image;
                            return (0,
                            n.jsx)("div", {
                                className: "icon-image-container",
                                children: i && (0,
                                n.jsx)(l.c, {
                                    image: {
                                        fill: !1,
                                        width: 200,
                                        height: 200,
                                        ...i
                                    },
                                    id: "IconsCarouselRow" + t
                                })
                            }, String(e.image && e.image.src || t))
                        }
                        )
                    })
                })
            })
        }
        ;
        d.default.picture.withConfig({
            componentId: "sc-41f9661a-0"
        })(["display:flex;align-items:center;justify-content:center;"]);
        let C = (0,
        d.default)(s.Container).withConfig({
            componentId: "sc-41f9661a-1"
        })(["width:100%;overflow:hidden;user-select:none;.icon-image-container{position:relative;", ";.media-render-container{height:100%;img{width:auto;height:100%;}}}"], (0,
        c.zD)("height", 60, 80, 100))
    },
    76103: function(e, t, i) {
        "use strict";
        var n = i(11183)
          , o = i(4517)
          , a = i(59173);
        t.Z = () => (0,
        n.jsxs)(s, {
            children: [(0,
            n.jsx)("span", {}), (0,
            n.jsx)("span", {}), (0,
            n.jsx)("span", {})]
        });
        let l = (0,
        a.keyframes)(["0%{background:currentColor;}25%{background:hsl(220,5%,80%);}50%{background:currentColor;}100%{background:currentColor;}"])
          , s = a.default.span.withConfig({
            componentId: "sc-9e5c516c-0"
        })(["display:flex;gap:3px;width:", "px !important;height:8px;align-items:center;padding:0;position:absolute;left:50%;top:50%;z-index:", ";transform:translate(-50%,-50%);span{width:8px;height:8px;border-radius:50%;background:white;transform:scale(0.8);}> span:nth-of-type(1){animation:0.6s ", " linear infinite;animation-delay:-0.6s;}> span:nth-of-type(2){animation:0.6s ", " linear infinite;animation-delay:-0.4s;}> span:nth-of-type(3){animation:0.6s ", " linear infinite;animation-delay:-0.2s;}"], 30, o.Z["z-loading-50"], l, l, l)
    },
    98417: function(e, t, i) {
        "use strict";
        i.d(t, {
            II: function() {
                return l
            }
        });
        var n = i(51046)
          , o = i(59173);
        let a = (0,
        o.css)(["outline:0;font-size:inherit;line-height:24px;display:block;width:100%;color:inherit;background:hsla(0,0%,100%,0.2);border-radius:5em;background-clip:padding-box;border:none;transition:background 0.2s ease,border 0.2s ease;padding:0 1.5em;&::placeholder{color:currentColor;opacity:0.4;}"])
          , l = o.default.input.withConfig({
            componentId: "sc-6af23bdb-0"
        })(["", ";line-height:1.33em;transition:color 0.2s ease;", ""], a, e => (0,
        o.css)(["", " font-size:16px;height:", "px;padding:", ";line-height:1.33em;"], e.$error && (0,
        o.css)(["border-color:red;"]), e.$size === n.c6.large ? 54 : e.$size === n.c6.tiny ? 32 : e.$size === n.c6.small ? 40 : 46, e.$size === n.c6.tiny ? "0 1.25em" : "0 1.5em"));
        o.default.textarea.withConfig({
            componentId: "sc-6af23bdb-1"
        })(["", ";", ";resize:none;"], a, e => e.error && "border-color: red")
    },
    60794: function(e, t, i) {
        "use strict";
        i.d(t, {
            Y: function() {
                return c
            }
        });
        var n = i(11183)
          , o = i(11178)
          , a = i(97570)
          , l = i(34764)
          , s = i(50017)
          , r = i(59173);
        let c = e => {
            let t = (0,
            o.useRef)(null)
              , i = (0,
            o.useRef)([])
              , [s,r] = (0,
            o.useState)([])
              , [c,u] = (0,
            o.useState)(!1);
            (0,
            o.useEffect)( () => {
                if (Array.isArray(e.text))
                    return r(e.text);
                let i = t.current;
                if (!i)
                    return;
                let n = () => i.childNodes[0] ? function(e) {
                    if (!e)
                        return;
                    let t = document.createRange()
                      , i = [];
                    t.setStart(e, 0);
                    let n = t.getBoundingClientRect().bottom
                      , o = e.textContent;
                    if (!o)
                        return;
                    let a = 1
                      , l = 0
                      , s = 0;
                    for (; a <= o.length; )
                        t.setStart(e, a),
                        a < o.length - 1 && t.setEnd(e, a + 1),
                        (s = t.getBoundingClientRect().bottom) > n && (i.push(o.substring(l, a)),
                        n = s,
                        l = a),
                        a++;
                    return i.push(o.substring(l)),
                    r(i)
                }(i.childNodes[0]) : null;
                n();
                let o = new ResizeObserver( () => n());
                return o.observe(i),
                () => o.unobserve(i)
            }
            , [e.text]);
            let {preloaded: x} = (0,
            o.useContext)(l.t)
              , {ref: f, inView: v} = (0,
            a.YD)({
                threshold: .9,
                triggerOnce: !0
            })
              , [b,w] = (0,
            o.useState)(!1);
            return (0,
            o.useEffect)( () => {
                e.confirm && void 0 !== e.confirmStatus ? w(v && e.confirmStatus) : w(v)
            }
            , [v, e.confirm, e.confirmStatus]),
            (0,
            o.useEffect)( () => {
                try {
                    if (b && x && s.length > 0) {
                        let t = (e.delay || 0) + (s.length - 1) * .1 + 1.6
                          , i = setTimeout( () => {
                            u(!0)
                        }
                        , 1e3 * t);
                        return () => clearTimeout(i)
                    }
                } catch (e) {
                    console.error("Error in LineEffect useEffect:", e)
                }
            }
            , [b, x, s.length, e.delay]),
            (0,
            n.jsxs)(g, {
                className: "EffectContainer_wrap",
                ref: f,
                children: [!Array.isArray(e.text) && (0,
                n.jsx)(m, {
                    ref: t,
                    $alignLeft: e.alignLeft,
                    className: "rendered-lines",
                    children: c ? null : e.text
                }), (0,
                n.jsx)(h, {
                    className: "computed_lines",
                    $alignLeft: e.alignLeft,
                    $isInView: b && x,
                    children: s.map( (t, o) => (0,
                    n.jsx)(d, {
                        className: "line",
                        ref: e => e ? i.current[o] = e : null,
                        children: (0,
                        n.jsx)(p, {
                            style: {
                                transitionDelay: "".concat(((e.delay || 0) + .1 * o).toFixed(3), "s")
                            },
                            "data-type": "line",
                            className: "line-inner",
                            children: t
                        })
                    }, "".concat(e.id, "-").concat(o)))
                })]
            })
        }
          , d = r.default.span.withConfig({
            componentId: "sc-32a672d4-0"
        })(["display:block;padding:0.25em;margin:-0.25em;", " transform-style:preserve-3d;transform-origin:0% 50%;"], (0,
        s.zD)("perspective", 100, 500, 600))
          , p = r.default.span.withConfig({
            componentId: "sc-32a672d4-1"
        })(["display:block;"])
          , u = r.default.span.withConfig({
            componentId: "sc-32a672d4-2"
        })(["grid-column:1;text-align:", ";grid-row:1;align-self:end;user-select:none;pointer-events:none;width:100%;"], e => e.$alignLeft ? "left" : "center")
          , m = (0,
        r.default)(u).withConfig({
            componentId: "sc-32a672d4-3"
        })(["opacity:0;"])
          , h = (0,
        r.default)(u).withConfig({
            componentId: "sc-32a672d4-4"
        })(["display:flex;flex-direction:column;align-items:", ";flex-wrap:nowrap;", ""], e => e.$alignLeft ? "start" : "center", e => (0,
        r.css)(["", ""], e.$isInView ? (0,
        r.css)(["", "{transition-property:transform,opacity;transition-timing-function:cubic-bezier(0.1,0.75,0.3,1),ease;transition-duration:1.6s,1.2s;transform:translateY(0em);will-change:transform;}"], p) : (0,
        r.css)(["", "{transition-property:transform,opacity;transition-timing-function:", ",ease;transition-duration:0.8s,0.6s;transition-delay:0s !important;transform:translateY(1.35em) rotateX(-30deg);opacity:0;}"], p, s.YQ)))
          , g = r.default.span.withConfig({
            componentId: "sc-32a672d4-5"
        })(["display:grid;max-width:100%;"])
    },
    54282: function(e, t, i) {
        "use strict";
        i.d(t, {
            HomeIconsCarousel: function() {
                return d
            }
        });
        var n = i(11183)
          , o = i(51953)
          , a = i(11178)
          , l = i(40912)
          , s = i(51046)
          , r = i(34764)
          , c = i(59173);
        function d(e) {
            var t;
            let {iconsCarousel: i, onlySingle: l} = e
              , {isMobile: c} = (0,
            a.useContext)(r.t)
              , d = i && (null === (t = i.icons) || void 0 === t ? void 0 : t.map(e => !1 === c ? e.media : e.mediaMobile));
            return (0,
            n.jsx)(n.Fragment, {
                children: d && (0,
                n.jsxs)(p, {
                    className: "icons-carousel-outer",
                    children: [(0,
                    n.jsx)(u, {
                        $layoutWidth: s.c6.regular,
                        children: (0,
                        n.jsx)("h2", {
                            className: "h3 icons-carousel-title",
                            children: null == i ? void 0 : i.title
                        })
                    }), (0,
                    n.jsx)(o.H, {
                        medias: d,
                        spaceBottom: (null == i ? void 0 : i.noSpaceBottom) ? s.c6.none : void 0,
                        onlySingle: l
                    })]
                })
            })
        }
        let p = (0,
        c.default)(l.Container).withConfig({
            componentId: "sc-bd1ab190-0"
        })(["h2{margin-bottom:0;}"])
          , u = (0,
        c.default)(l.Container).withConfig({
            componentId: "sc-bd1ab190-1"
        })(["padding:0 0 20px 0;"])
    },
    28307: function(e, t, i) {
        "use strict";
        i.d(t, {
            I: function() {
                return m
            }
        });
        var n = i(11183)
          , o = i(11178)
          , a = i(43289)
          , l = i(40912)
          , s = i(51046)
          , r = i(21226)
          , c = i(34764)
          , d = i(60557)
          , p = i(50017)
          , u = i(59173);
        function m(e) {
            let {eblStepArrayList: t} = e
              , {isMobile: i} = (0,
            o.useContext)(c.t);
            return (0,
            n.jsx)(h, {
                $layoutWidth: s.c6.regular,
                children: void 0 !== i && t.map(e => (0,
                n.jsxs)("div", {
                    children: [e.divider && (0,
                    n.jsx)(g, {
                        className: "ebl-step-array-divier",
                        $spaceTop: s.c6.regular,
                        children: e.divider
                    }), (0,
                    n.jsx)(x, {
                        className: "ebl-step-array-container",
                        $spaceTop: s.c6.regular,
                        children: e.items.map( (e, t) => {
                            let o = !1 === i ? e.media : e.mediaMobile;
                            return (0,
                            n.jsxs)("div", {
                                className: "ebl-step-item-container",
                                children: [t > 0 && (0,
                                n.jsx)("div", {
                                    className: "ebl-step-item-arrow-container",
                                    children: (0,
                                    n.jsx)(r.Z, {})
                                }), (0,
                                n.jsx)("div", {
                                    className: "el-step-index",
                                    children: t + 1
                                }), (0,
                                n.jsx)("div", {
                                    className: "ebl-step-item-title",
                                    children: !1 === i ? e.title : e.mobileTitle
                                }), o && (0,
                                n.jsx)(f, {
                                    className: "ebl-step-item-media",
                                    $mediaAspectRatio: o.aspectRatio,
                                    children: (0,
                                    n.jsx)(a.c, {
                                        ...o,
                                        id: "ebl-step-item-media" + e.title
                                    })
                                }), (0,
                                n.jsx)("div", {
                                    className: "ebl-step-item-description",
                                    children: e.description
                                })]
                            }, e.title)
                        }
                        )
                    })]
                }, e.title))
            })
        }
        let h = (0,
        u.default)(l.Container).withConfig({
            componentId: "sc-a0c12fca-0"
        })(["", "{padding:0 5%;}"], p.Ng)
          , g = (0,
        u.default)(l.Container).withConfig({
            componentId: "sc-a0c12fca-1"
        })([""])
          , x = (0,
        u.default)(l.Container).withConfig({
            componentId: "sc-a0c12fca-2"
        })(["display:flex;justify-content:center;", "{flex-direction:column;}.ebl-step-item-container{flex:1;position:relative;", "{&:not(:first-child){margin:0 0 0 50px;}padding:0 0 0 50px;}", "{&:not(:first-child){margin:63px 0 0 0;}}.ebl-step-item-arrow-container{position:absolute;", "{top:45%;left:-15px;}", "{top:-42px;left:48%;transform:rotate(90deg);}width:22px;height:24px;}.el-step-index{position:absolute;top:0px;", "{left:15px;}width:22px;height:22px;line-height:22px;display:flex;align-items:center;justify-content:center;border:1.5px solid ", ";border-radius:50%;}.ebl-step-item-title{white-space:pre-line;text-align:left;", "{padding:0 0 0 30px;}}.ebl-step-item-description{padding:10px 0 0 0;text-align:left;}}"], p.AB, p.Ng, p.AB, p.Ng, p.AB, p.Ng, d.$_.color, p.AB)
          , f = u.default.div.withConfig({
            componentId: "sc-a0c12fca-3"
        })(["position:relative;margin-top:10px;", ";"], e => e.$mediaAspectRatio && (0,
        u.css)(["aspect-ratio:", ";"], e.$mediaAspectRatio))
    },
    29993: function(e, t, i) {
        "use strict";
        i.d(t, {
            $: function() {
                return c
            }
        });
        var n = i(11183)
          , o = i(40912)
          , a = i(22529)
          , l = i(51046)
          , s = i(50017)
          , r = i(67638);
        function c(e) {
            var t, i, o, s, c;
            let {screen: p} = e;
            return (0,
            r.Y)(null == p ? void 0 : p.visible) ? (0,
            n.jsx)(n.Fragment, {
                children: p && (0,
                n.jsx)(d, {
                    $spaceTop: l.c6.large,
                    children: (0,
                    n.jsx)(a.k, {
                        contentImax: (0,
                        n.jsxs)(n.Fragment, {
                            children: [(0,
                            n.jsx)("h2", {
                                className: "h4",
                                children: null === (t = p.imax) || void 0 === t ? void 0 : t.title
                            }), (0,
                            n.jsx)("p", {
                                children: null === (i = p.imax) || void 0 === i ? void 0 : i.description
                            })]
                        }),
                        contentImage: null === (o = p.contentImage) || void 0 === o ? void 0 : o.image,
                        imaxImage: null === (s = p.imaxImage) || void 0 === s ? void 0 : s.image,
                        seatsImage: null === (c = p.seatsImage) || void 0 === c ? void 0 : c.image
                    })
                })
            }) : null
        }
        let d = (0,
        i(59173).default)(o.Container).withConfig({
            componentId: "sc-dbaf968b-0"
        })(["", "{margin-bottom:-100px;}"], s.Ng)
    },
    89754: function(e, t, i) {
        "use strict";
        i.d(t, {
            l: function() {
                return m
            }
        });
        var n = i(11183)
          , o = i(11178)
          , a = i(97570)
          , l = i(43289)
          , s = i(51046)
          , r = i(34764)
          , c = i(50017)
          , d = i(59173)
          , p = i(40912)
          , u = i(52002);
        let m = e => {
            let {isMobile: t} = (0,
            o.useContext)(r.t)
              , i = e.data ? e.data.map( (t, i) => ({
                ...t,
                id: "".concat(e.id, "-").concat(i)
            })) : [];
            return (0,
            n.jsx)(n.Fragment, {
                children: void 0 !== t && (t && !e.contentFlowMobile ? (0,
                n.jsx)(u._o, {
                    data: i,
                    id: "".concat(e.id, "-mobileSlider")
                }) : (0,
                n.jsx)(h, {
                    ...e
                }))
            })
        }
          , h = e => {
            let {isMobile: t} = (0,
            o.useContext)(r.t)
              , [i,a] = (0,
            o.useState)(0);
            return (0,
            n.jsxs)(C, {
                $grid: !0,
                $layoutWidth: s.c6.regular,
                $spaceBottom: s.c6.large,
                $isReverted: e.isReverted,
                className: "story-switch-render",
                children: [(0,
                n.jsxs)(v, {
                    className: "story-switch-render-data-column",
                    $gapSize: e.dataColumnGapSize,
                    children: [e.dataColumnTitle && (0,
                    n.jsx)(b, {
                        className: "h3 data-column-title",
                        $contentFlowMobile: e.contentFlowMobile,
                        children: e.dataColumnTitle
                    }), e.data && e.data.map( (o, l) => (0,
                    n.jsx)(g, {
                        data: o,
                        isActive: i === l,
                        setActive: () => a(l),
                        id: "".concat(e.id, "-dataCol-").concat(l, "-inner"),
                        mediaRatio: e.mediaRatio,
                        isMobile: t,
                        index: l,
                        contentFlowMobile: e.contentFlowMobile
                    }, "".concat(e.id, "-dataCol-").concat(l)))]
                }), !1 === t && (0,
                n.jsx)(y, {
                    className: "story-switch-render-images-column",
                    $aspectRatio: e.mediaRatio,
                    $id: "".concat(e.id, "-cssContainer"),
                    children: (0,
                    n.jsx)(j, {
                        children: e.data && e.data.map( (t, o) => (0,
                        n.jsx)(w, {
                            style: {
                                opacity: i === o ? 1 : 0
                            },
                            children: (0,
                            n.jsx)(l.c, {
                                ...t.media,
                                id: "".concat(e.id, "-media-").concat(o),
                                isContain: t.isMediaContain
                            })
                        }, "".concat(e.id, "-mediaCol-").concat(o)))
                    })
                })]
            })
        }
          , g = e => {
            var t;
            let {ref: i, inView: s} = (0,
            a.YD)({
                threshold: 0,
                rootMargin: "-49% 0% -49% 0%"
            });
            return (0,
            o.useEffect)( () => {
                s && e.setActive()
            }
            , [s]),
            (0,
            n.jsxs)(f, {
                ref: i,
                $isActive: e.isActive,
                $contentFlowMobile: e.contentFlowMobile,
                children: [(0,
                n.jsx)(x, {
                    $contentFlowMobile: e.contentFlowMobile,
                    children: e.data.content
                }), e.isMobile && (0,
                n.jsx)("div", {
                    className: "data-entry-media-container",
                    style: {
                        aspectRatio: null === (t = e.data.media) || void 0 === t ? void 0 : t.aspectRatio
                    },
                    children: (0,
                    n.jsx)(l.c, {
                        ...e.data.media,
                        id: "".concat(e.id, "-media-").concat(e.index),
                        isContain: e.data.isMediaContain
                    })
                })]
            })
        }
          , x = (0,
        d.default)(p.ContentColumn).withConfig({
            componentId: "sc-35ea86d3-0"
        })(["", "{", "}"], c.AB, e => e.$contentFlowMobile ? (0,
        d.css)(["text-align:left;"]) : (0,
        d.css)(["padding-left:1em;padding-right:1em;"]))
          , f = d.default.div.withConfig({
            componentId: "sc-35ea86d3-1"
        })(["transition:opacity 0.3s ease;", "{", "}.data-entry-media-container{position:relative;width:100%;", "}"], c.Ng, e => (0,
        d.css)(["opacity:", ";"], e.$isActive ? 1 : .4), e => e.$contentFlowMobile && (0,
        d.css)(["padding-top:1em;"]))
          , v = d.default.div.withConfig({
            componentId: "sc-35ea86d3-2"
        })(["", "{padding:50lvh 0;}grid-row:1;grid-column:1 / 5;display:flex;flex-direction:column;", ";", "{grid-column:1 / 7;text-align:center;}.data-column-title{line-height:1.15;}"], c.Ng, e => (e.$gapSize,
        s.c6.small,
        (0,
        d.css)(["", ""], (0,
        c.zD)("gap", 48, 60, 80))), c.AB)
          , b = d.default.div.withConfig({
            componentId: "sc-35ea86d3-3"
        })(["", "{", "}"], c.AB, e => e.$contentFlowMobile && (0,
        d.css)(["text-align:left;"]))
          , w = d.default.div.withConfig({
            componentId: "sc-35ea86d3-4"
        })(["grid-row:1;", "{transition:opacity 0.4s ease;}", "{position:relative;", "}"], c.Ng, c.AB, c.$e)
          , j = d.default.div.withConfig({
            componentId: "sc-35ea86d3-5"
        })(["position:relative;", ""], c.$e)
          , y = d.default.div.withConfig({
            componentId: "sc-35ea86d3-6"
        })(["position:relative;position:sticky;top:20px;height:calc(100lvh - 40px);", "{", "}align-items:center;display:grid;resize:none;overflow:hidden;", ""], c.Ng, (0,
        c.zD)("padding-top", 72, 80, 86), e => (0,
        d.css)(["container:", " / size;@container ", " (min-aspect-ratio:", "){justify-content:space-around;}", "{aspect-ratio:", ";width:100%;height:auto;@container ", " (min-aspect-ratio:", "){width:auto;height:100%;}}"], e.$id, e.$id, e.$aspectRatio, j, e.$aspectRatio, e.$id, e.$aspectRatio))
          , C = (0,
        d.default)(p.Container).withConfig({
            componentId: "sc-35ea86d3-7"
        })(["", " ", "{", "{grid-column:1 / 7;}}"], e => (0,
        d.css)(["", "{grid-column:", ";}", "{grid-column:", ";}"], v, e.$isReverted ? "9 / 13" : "1 / 5", y, e.$isReverted ? "1 / 8" : "6 / 13"), c.AB, v)
    },
    19714: function(e, t, i) {
        "use strict";
        i.d(t, {
            VisionMasterMaxContent: function() {
                return tJ
            }
        });
        var n, o, a, l, s, r, c, d, p, u, m = i(11183), h = i(40912), g = i(29993), x = i(51046), f = i(50017), v = i(59173), b = i(86928), w = i(11178), j = i(97570), y = i(43289), C = i(71707), I = i(25953), A = i(34764), N = i(4517), _ = i(67638);
        let z = e => {
            let {connectEverything: t} = e
              , {isMobile: i} = (0,
            w.useContext)(A.t)
              , n = (0,
            _.Y)(null == t ? void 0 : t.visible)
              , {setSecondNavCurrent: o} = (0,
            w.useContext)(C.x)
              , {ref: a, inView: l} = (0,
            j.YD)({
                threshold: 0
            });
            return ((0,
            w.useEffect)( () => {
                l && o("connectivity")
            }
            , [l]),
            t && n) ? (0,
            m.jsxs)(m.Fragment, {
                children: [(0,
                m.jsx)(k, {
                    id: "connectivity",
                    ref: a,
                    children: (0,
                    m.jsx)(I.R, {
                        isDisabledBottomSpace: !0,
                        title: null == t ? void 0 : t.topTips,
                        subTitle: (null == t ? void 0 : t.topTitle) || "",
                        id: "ScreenPlayItemTitleSection"
                    })
                }), void 0 !== i && i && (0,
                m.jsx)(T, {
                    $grid: !0,
                    $layoutWidth: "regular",
                    children: (0,
                    m.jsxs)("div", {
                        className: "content-wrap",
                        children: [(0,
                        m.jsx)("div", {
                            className: "h3",
                            children: null == t ? void 0 : t.bottomTitle
                        }), (0,
                        m.jsx)("div", {
                            className: "desc bodyMedium",
                            children: null == t ? void 0 : t.bottomDesc
                        })]
                    })
                }), (0,
                m.jsxs)($, {
                    $grid: !0,
                    $layoutWidth: "regular",
                    children: [(0,
                    m.jsx)(y.c, {
                        ...null == t ? void 0 : t.pcMedia,
                        id: "connect-everything-pc-media"
                    }), void 0 !== i && !i && (0,
                    m.jsxs)("div", {
                        className: "content-wrap",
                        children: [(0,
                        m.jsx)("div", {
                            className: "h3",
                            children: null == t ? void 0 : t.bottomTitle
                        }), (0,
                        m.jsx)("div", {
                            className: "desc bodyMedium",
                            children: null == t ? void 0 : t.bottomDesc
                        })]
                    })]
                })]
            }) : null
        }
          , k = v.default.div.withConfig({
            componentId: "sc-e9af72e0-0"
        })(["", "{padding-top:30px;}.title-section-sub-title--self{margin-bottom:0;}"], f.AB)
          , $ = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-e9af72e0-1"
        })(["aspect-ratio:1320 / 793;position:relative;", "{aspect-ratio:358 / 215;}.content-wrap{margin-top:19.3%;grid-column:3 / 11;z-index:", ";text-align:center;.h3{line-height:115%;letter-spacing:-1.2px;margin-bottom:16px;}}"], f.AB, N.Z["z-max-img-25"])
          , T = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-e9af72e0-2"
        })(["margin-top:60px;.content-wrap{grid-column:1 / 13;margin-bottom:-60px;z-index:", ";text-align:center;}.h3{line-height:115%;letter-spacing:-1.2px;margin-bottom:12px;}"], N.Z["z-max-img-25"]);
        var S = i(40947)
          , E = i(28307)
          , M = i(21226)
          , B = i(60557);
        function D(e) {
            let {eblStepArrayList: t} = e;
            return (0,
            m.jsx)(R, {
                children: t.map(e => (0,
                m.jsxs)("div", {
                    children: [e.divider && (0,
                    m.jsx)(L, {
                        className: "ebl-step-array-divier",
                        $spaceTop: x.c6.regular,
                        children: e.divider
                    }), (0,
                    m.jsx)(F, {
                        className: "ebl-step-array-container",
                        children: e.items.map( (t, i) => {
                            let n = t.mediaMobile || t.media;
                            return (0,
                            m.jsxs)("div", {
                                className: "ebl-step-item-container",
                                children: [(0,
                                m.jsxs)("div", {
                                    className: "ebl-step-item-content",
                                    children: [(0,
                                    m.jsx)("div", {
                                        className: "el-step-index",
                                        children: i + 1
                                    }), (0,
                                    m.jsx)("div", {
                                        className: "ebl-step-item-title",
                                        children: t.mobileTitle || t.title
                                    }), n && (0,
                                    m.jsx)(P, {
                                        className: "ebl-step-item-media",
                                        $mediaAspectRatio: n.aspectRatio,
                                        children: (0,
                                        m.jsx)(y.c, {
                                            ...n,
                                            id: "mobile-ebl-step-item-media" + t.title
                                        })
                                    }), (0,
                                    m.jsx)("div", {
                                        className: "ebl-step-item-description",
                                        children: t.description
                                    })]
                                }), i < e.items.length - 1 && (0,
                                m.jsx)("div", {
                                    className: "ebl-step-item-arrow-container",
                                    children: (0,
                                    m.jsx)(M.Z, {})
                                })]
                            }, t.title)
                        }
                        )
                    })]
                }, e.title))
            })
        }
        let R = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-b81e0e3d-0"
        })(["margin-top:60px;"])
          , L = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-b81e0e3d-1"
        })([""])
          , F = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-b81e0e3d-2"
        })(["", " ", " ", "{display:flex;flex-direction:row;overflow-x:auto;overflow-y:hidden;scroll-behavior:smooth;-webkit-overflow-scrolling:touch;justify-content:flex-start;scrollbar-width:none;-ms-overflow-style:none;&::-webkit-scrollbar{display:none;}}.ebl-step-item-container{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:nowrap;}.ebl-step-item-arrow-container{width:25px;height:100%;flex-shrink:0;margin-left:10px;margin-right:10px;display:flex;align-items:center;justify-content:center;svg{height:27px;}}.ebl-step-item-arrow-container{}.ebl-step-item-content{position:relative;", "{flex:0 0 auto;width:76.15vw;margin:0;}.el-step-index{position:absolute;top:0px;", "{left:0px;width:22px;height:22px;display:flex;align-items:center;justify-content:center;border:1.5px solid ", ";border-radius:50%;}}.ebl-step-item-title{white-space:pre-line;text-align:left;height:44px;", "{padding:0 0 0 30px;margin-bottom:10px;}}.ebl-step-item-description{padding:10px 0 0 0;text-align:left;", "{font-size:14px;line-height:1.4;}}}"], (0,
        f.zD)("padding-left", 16, 60, 760), (0,
        f.zD)("padding-right", 16, 60, 760), f.AB, f.AB, f.AB, B.$_.color, f.AB, f.AB)
          , P = v.default.div.withConfig({
            componentId: "sc-b81e0e3d-3"
        })(["position:relative;margin-top:10px;", ";", "{border-radius:8px;overflow:hidden;}"], e => e.$mediaAspectRatio && (0,
        v.css)(["aspect-ratio:", ";"], e.$mediaAspectRatio), f.AB);
        var U = function(e) {
            let {eblStep: t} = e
              , {isMobile: i} = (0,
            w.useContext)(A.t);
            return (0,
            m.jsxs)(m.Fragment, {
                children: [(null == t ? void 0 : t.visible) && t.eblStepArrayList && !0 !== i && (0,
                m.jsx)(E.I, {
                    eblStepArrayList: t.eblStepArrayList
                }), (null == t ? void 0 : t.visible) && t.eblStepArrayList && !0 === i && (0,
                m.jsx)(D, {
                    eblStepArrayList: t.eblStepArrayList
                })]
            })
        };
        let W = e => {
            var t, i;
            let {flawlessDarkScene: n} = e
              , {isMobile: o} = (0,
            w.useContext)(A.t)
              , a = (0,
            _.Y)(null == n ? void 0 : n.visible);
            if (!n || !a)
                return null;
            let l = o ? n.mobileMedia : n.pcMedia;
            return (0,
            m.jsxs)(H, {
                children: [(0,
                m.jsxs)(O, {
                    children: [(0,
                    m.jsx)(V, {
                        style: {
                            aspectRatio: null == l ? void 0 : l.aspectRatio
                        },
                        children: (0,
                        m.jsx)(y.c, {
                            ...l,
                            id: "flawless-dark-scene-media"
                        })
                    }), void 0 !== o && !o && (0,
                    m.jsx)(Y, {
                        $grid: !0,
                        $layoutWidth: "regular",
                        children: (0,
                        m.jsxs)("div", {
                            className: "text-wrap",
                            children: [(0,
                            m.jsx)("div", {
                                className: "label tip",
                                children: n.tips
                            }), (0,
                            m.jsx)("div", {
                                className: "h3 title",
                                children: n.title
                            }), (0,
                            m.jsx)("div", {
                                className: "desc-list",
                                children: null === (t = n.descList) || void 0 === t ? void 0 : t.map( (e, t) => (0,
                                m.jsxs)("div", {
                                    className: "desc-item",
                                    children: [(0,
                                    m.jsx)("div", {
                                        className: "desc-item-icon"
                                    }), (0,
                                    m.jsx)("div", {
                                        className: "desc-item-text bodyMedium",
                                        children: e.descItem
                                    })]
                                }, "".concat(t, "-").concat(e.descItem)))
                            })]
                        })
                    })]
                }), void 0 !== o && o && (0,
                m.jsx)(Y, {
                    $grid: !0,
                    $layoutWidth: "regular",
                    children: (0,
                    m.jsxs)("div", {
                        className: "text-wrap",
                        children: [(0,
                        m.jsx)("div", {
                            className: "label tip",
                            children: n.tips
                        }), (0,
                        m.jsx)("div", {
                            className: "h3 title",
                            children: n.title
                        }), (0,
                        m.jsx)("div", {
                            className: "desc-list",
                            children: null === (i = n.descList) || void 0 === i ? void 0 : i.map( (e, t) => (0,
                            m.jsxs)("div", {
                                className: "desc-item",
                                children: [(0,
                                m.jsx)("div", {
                                    className: "desc-item-icon"
                                }), (0,
                                m.jsx)("div", {
                                    className: "desc-item-text bodyMedium",
                                    children: e.descItem
                                })]
                            }, "".concat(t, "-").concat(e.descItem)))
                        })]
                    })
                })]
            })
        }
          , H = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-9aec9ca-0"
        })([""])
          , O = v.default.div.withConfig({
            componentId: "sc-9aec9ca-1"
        })(["", " width:100%;height:830px;position:relative;background-color:#000;", "{height:585px;}"], (0,
        f.zD)("padding-top", 45, 80, 100), f.AB)
          , V = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-9aec9ca-2"
        })(["position:relative;", "{}", "{width:100%;margin-bottom:-20%;}"], f.Ng, f.AB)
          , Y = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-9aec9ca-3"
        })(["position:absolute;top:0;left:0;right:0;bottom:0;height:100%;z-index:", ";margin:0 auto;.text-wrap{grid-column:9 / -1;", "{padding-top:184px;}display:flex;flex-direction:column;row-gap:20px;.title{line-height:115%;letter-spacing:-1.2px;}.desc-list{display:flex;flex-direction:column;row-gap:12px;.desc-item{display:flex;align-items:flex-start;column-gap:12px;.desc-item-icon{width:16px;height:1px;position:relative;top:16px;background:rgba(255,255,255,0.6);}}}}", "{position:relative;margin-top:-60px;.text-wrap{row-gap:16px;grid-column:1 / -1;.desc-list{row-gap:8px;.desc-item{column-gap:10px;.desc-item-icon{top:11px;width:12px;}}}}}"], N.Z["z-max-img-25"], f.Ng, f.AB)
          , G = e => {
            let {HDRHideDetail: t} = e
              , {isMobile: i} = (0,
            w.useContext)(A.t)
              , n = (0,
            _.Y)(null == t ? void 0 : t.visible);
            return t && n ? (0,
            m.jsxs)(m.Fragment, {
                children: [(0,
                m.jsx)(Z, {
                    $spaceTop: x.c6.medium
                }), void 0 !== i && i && (0,
                m.jsx)(X, {
                    $grid: !0,
                    $layoutWidth: "regular",
                    children: (0,
                    m.jsxs)("div", {
                        className: "content-wrap",
                        children: [(0,
                        m.jsx)("div", {
                            className: "tips label",
                            children: t.tips
                        }), (0,
                        m.jsx)("div", {
                            className: "title h3",
                            children: t.title
                        }), (0,
                        m.jsx)("div", {
                            className: "desc bodyMedium",
                            children: t.desc
                        })]
                    })
                }), (0,
                m.jsxs)(Q, {
                    $grid: !0,
                    $layoutWidth: "regular",
                    children: [(0,
                    m.jsx)("div", {
                        className: "img-wrap",
                        children: (0,
                        m.jsx)(y.c, {
                            ...t.pcMedia,
                            id: "hdr-hide-detail-pc-media"
                        })
                    }), void 0 !== i && !i && (0,
                    m.jsxs)("div", {
                        className: "content-wrap",
                        children: [(0,
                        m.jsx)("div", {
                            className: "tips label",
                            children: t.tips
                        }), (0,
                        m.jsx)("div", {
                            className: "title h3",
                            children: t.title
                        }), (0,
                        m.jsx)("div", {
                            className: "desc bodyMedium",
                            children: t.desc
                        })]
                    })]
                })]
            }) : null
        }
          , Z = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-1adb64e7-0"
        })([""])
          , Q = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-1adb64e7-1"
        })(["aspect-ratio:1320 / 538;position:relative;", "{aspect-ratio:358 / 253;}.img-wrap{height:100%;aspect-ratio:762 / 538;position:relative;border-radius:10px;overflow:hidden;", "{grid-column:1 / -1;width:100%;}}.content-wrap{grid-column:9 / -1;display:flex;justify-content:center;flex-direction:column;row-gap:20px;.title{line-height:115%;letter-spacing:-1.2px;}}"], f.AB, f.AB)
          , X = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-1adb64e7-2"
        })(["margin-bottom:24px;.content-wrap{grid-column:1 / -1;display:flex;flex-direction:column;row-gap:16px;text-align:center;.title{line-height:115%;letter-spacing:-0.78px;}}"]);
        var J = i(93356)
          , q = i(54282);
        function K(e) {
            let {iconsCarousel: t, spaceTop: i} = e
              , {isMobile: n} = (0,
            w.useContext)(A.t)
              , o = t && (null == t ? void 0 : t.visible) !== !1 && "boolean" == typeof n;
            return (0,
            m.jsx)(m.Fragment, {
                children: o && (0,
                m.jsx)(ee, {
                    $spaceTop: i,
                    children: (0,
                    m.jsx)(q.HomeIconsCarousel, {
                        iconsCarousel: t ? {
                            ...t,
                            noSpaceBottom: !0
                        } : void 0,
                        onlySingle: n ? t.onlySingleMobile : t.onlySingleDesktop
                    })
                })
            })
        }
        let ee = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-b0794b2b-0"
        })([""]);
        var et = i(51789);
        function ei(e) {
            var t;
            let {mediaReviews: i} = e
              , {isMobile: n} = (0,
            w.useContext)(A.t);
            return (0,
            m.jsx)(m.Fragment, {
                children: "boolean" == typeof n && (null == i ? void 0 : i.visible) && (null == i ? void 0 : i.items) && (null == i ? void 0 : null === (t = i.items) || void 0 === t ? void 0 : t.length) > 0 && (0,
                m.jsx)(en, {
                    $spaceTop: x.c6.extraLarge,
                    children: (0,
                    m.jsx)(et.Reviews, {
                        isCenter: !0,
                        data: null == i ? void 0 : i.items,
                        id: "reviews",
                        onlySingle: n ? null == i ? void 0 : i.onlySingleMobile : null == i ? void 0 : i.onlySingleDesktop
                    })
                })
            })
        }
        let en = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-cbf8e0cd-0"
        })([""]);
        var eo = i(96022);
        function ea(e) {
            let {featureGrids: t} = e
              , {isMobile: i} = (0,
            w.useContext)(A.t)
              , {setSecondNavCurrent: n} = (0,
            w.useContext)(C.x)
              , {ref: o, inView: a} = (0,
            j.YD)({
                threshold: 0
            });
            return (0,
            w.useEffect)( () => {
                a && n("overview")
            }
            , [a]),
            (0,
            m.jsx)(m.Fragment, {
                children: (null == t ? void 0 : t.visible) && t.items && (0,
                m.jsxs)(el, {
                    ref: o,
                    id: i ? "overview" : void 0,
                    $spaceTop: x.c6.extraLarge,
                    $layoutWidth: x.c6.regular,
                    children: [(0,
                    m.jsx)("h3", {
                        id: i ? void 0 : "overview",
                        className: "vision-master-max-content-feature-grids-title",
                        children: t.title
                    }), (0,
                    m.jsx)(eo.O, {
                        ...t,
                        isDesktopFlex: t.featuresGridDesktopFlex,
                        isMobileFlex: t.featuresGridMobleFlex,
                        spaceTop: x.c6.regular,
                        data: t.items,
                        id: "vision-master-max-content-feature-grids"
                    })]
                })
            })
        }
        let el = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-69d00a8a-0"
        })([".vision-master-max-content-feature-grids-title{margin-bottom:0;text-align:center;", ";}"], (0,
        f.zD)("font-size", 48, 120, 140));
        (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-69d00a8a-1"
        })([""]);
        let es = e => {
            let {screenPlays: t, screenPlaysBottomInfo: i} = e
              , {isMobile: n} = (0,
            w.useContext)(A.t)
              , {setSecondNavCurrent: o} = (0,
            w.useContext)(C.x)
              , a = (0,
            _.Y)(null == t ? void 0 : t.visible)
              , [l,s] = (0,
            w.useState)(!1)
              , [r,c] = (0,
            w.useState)(!1)
              , {ref: d, inView: p, entry: u} = (0,
            j.YD)({
                threshold: .8,
                triggerOnce: !1
            });
            if ((0,
            w.useEffect)( () => {
                p && o("darkPerformance")
            }
            , [p]),
            (0,
            w.useEffect)( () => {
                p && (null == u ? void 0 : u.intersectionRatio) && u.intersectionRatio >= .8 && !r && (s(!0),
                c(!0))
            }
            , [p, null == u ? void 0 : u.intersectionRatio, r]),
            !a || !t)
                return null;
            let h = n ? t.mobileMaskImage : t.pcMaskImage
              , g = n ? t.mobileScreenMedia : t.pcScreenMedia;
            return (0,
            m.jsxs)(er, {
                $spaceTop: x.c6.extraLarge,
                children: [(0,
                m.jsxs)(ep, {
                    id: "darkPerformance",
                    ref: d,
                    children: [(0,
                    m.jsx)("div", {
                        className: "screen-play__mask ".concat(l || r ? "hidden" : ""),
                        children: (0,
                        m.jsx)(y.c, {
                            ...h,
                            id: "screen-play-item-mask-image"
                        })
                    }), (0,
                    m.jsx)("div", {
                        className: "screen-play__content",
                        children: (0,
                        m.jsx)(y.c, {
                            ...g,
                            isVideoPlaying: l,
                            id: "screen-play-item-content-image",
                            isStartFromBeginning: !0,
                            videoEndedHidden: !1,
                            videoProps: {
                                loop: !1,
                                autoPlay: !1,
                                muted: !0,
                                playsInline: !0,
                                preload: "auto",
                                controls: !1,
                                onEnded: () => {
                                    s(!1)
                                }
                            }
                        })
                    })]
                }), (0,
                m.jsx)(ec, {
                    children: (0,
                    m.jsx)(I.R, {
                        isDisabledBottomSpace: !0,
                        title: null == i ? void 0 : i.tips,
                        subTitle: (null == i ? void 0 : i.title) || "",
                        id: "ScreenPlayItemTitleSection"
                    })
                }), (0,
                m.jsx)(ed, {
                    $layoutWidth: x.c6.regular,
                    children: (0,
                    m.jsx)("div", {
                        className: "bodyMedium",
                        children: null == i ? void 0 : i.desc
                    })
                })]
            })
        }
          , er = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-b3dd4685-0"
        })([""])
          , ec = v.default.div.withConfig({
            componentId: "sc-b3dd4685-1"
        })(["", " position:relative;z-index:", ";.title-section-sub-title--self{margin-bottom:0;}"], (0,
        f.zD)("margin-top", -180, -120, -180), N.Z["z-max-img-25"])
          , ed = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-b3dd4685-2"
        })(["", " text-align:center;", "{position:relative;z-index:", ";}"], (0,
        f.zD)("margin-top", 24, 40, 56), f.AB, N.Z["z-max-img-25"])
          , ep = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-b3dd4685-3"
        })(["", " width:100%;position:relative;height:calc(100lvh - 80px);", "{height:calc(100lvh - 120px);}.screen-play__mask{position:absolute;top:0;left:0;width:100%;height:100%;z-index:2;transition:opacity 0.3s ease-in-out;&.hidden{opacity:0;pointer-events:none;}}.screen-play__content{position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;", "{height:auto;aspect-ratio:390 / 650;}}"], (0,
        f.zD)("padding-top", 80, 180, 260), f.AB, f.AB)
          , eu = e => {
            var t, i;
            let {sleekAndInnovativeDesign: n} = e
              , {isMobile: o} = (0,
            w.useContext)(A.t)
              , {setSecondNavCurrent: a} = (0,
            w.useContext)(C.x)
              , {ref: l, inView: s} = (0,
            j.YD)({
                threshold: 0
            });
            return (0,
            w.useEffect)( () => {
                s && a("Industrydesign")
            }
            , [s]),
            (0,
            m.jsxs)(m.Fragment, {
                children: [(0,
                m.jsx)(em, {
                    ref: l,
                    $spaceTop: "medium",
                    id: "Industrydesign"
                }), void 0 !== o && !o && (0,
                m.jsx)(m.Fragment, {
                    children: (0,
                    m.jsxs)(eh, {
                        $grid: !0,
                        $layoutWidth: "regular",
                        children: [(0,
                        m.jsx)(y.c, {
                            ...null == n ? void 0 : n.pcMedia,
                            id: "sleek-and-innovative-design-pc-media"
                        }), (0,
                        m.jsx)(eg, {
                            children: (0,
                            m.jsxs)("div", {
                                className: "content-wrap",
                                children: [(0,
                                m.jsxs)("div", {
                                    className: "text-wrap",
                                    children: [(0,
                                    m.jsx)("div", {
                                        className: "h3",
                                        children: null == n ? void 0 : n.title
                                    }), (0,
                                    m.jsx)("div", {
                                        className: "desc-wrap",
                                        children: null == n ? void 0 : null === (t = n.descList) || void 0 === t ? void 0 : t.map( (e, t) => (0,
                                        m.jsxs)("div", {
                                            className: "desc__item",
                                            children: [(0,
                                            m.jsx)("div", {
                                                className: "desc__icon"
                                            }), (0,
                                            m.jsxs)("div", {
                                                className: "desc__content",
                                                children: [(0,
                                                m.jsx)("span", {
                                                    className: "desc__title",
                                                    children: e.descTitle
                                                }), (0,
                                                m.jsx)("span", {
                                                    className: "desc__desc",
                                                    children: e.descDesc
                                                })]
                                            })]
                                        }, t))
                                    })]
                                }), (0,
                                m.jsx)("div", {
                                    className: "tips-media",
                                    children: (0,
                                    m.jsx)(y.c, {
                                        ...null == n ? void 0 : n.pcTipsMedia,
                                        id: "sleek-and-innovative-design-pc-tips-media"
                                    })
                                })]
                            })
                        })]
                    })
                }), void 0 !== o && o && (0,
                m.jsx)(ex, {
                    $grid: !0,
                    $layoutWidth: "regular",
                    children: (0,
                    m.jsx)("div", {
                        className: "content-wrap",
                        children: (0,
                        m.jsxs)("div", {
                            className: "text-wrap",
                            children: [(0,
                            m.jsx)("div", {
                                className: "h3",
                                children: null == n ? void 0 : n.title
                            }), (0,
                            m.jsx)("div", {
                                className: "desc-wrap",
                                children: null == n ? void 0 : null === (i = n.descList) || void 0 === i ? void 0 : i.map( (e, t) => (0,
                                m.jsxs)("div", {
                                    className: "desc__item",
                                    children: [(0,
                                    m.jsx)("div", {
                                        className: "desc__icon"
                                    }), (0,
                                    m.jsxs)("div", {
                                        className: "desc__content bodyMedium",
                                        children: [(0,
                                        m.jsx)("span", {
                                            className: "desc__title",
                                            children: e.descTitle
                                        }), (0,
                                        m.jsx)("span", {
                                            className: "desc__desc",
                                            children: e.descDesc
                                        })]
                                    })]
                                }, t))
                            })]
                        })
                    })
                })]
            })
        }
          , em = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-48a2342a-0"
        })([""])
          , eh = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-48a2342a-1"
        })(["aspect-ratio:1.69 / 1;position:relative;border-radius:20px;overflow:hidden;"])
          , eg = v.default.div.withConfig({
            componentId: "sc-48a2342a-2"
        })(["position:absolute;top:0;left:0;width:100%;height:100%;padding:60px;box-sizing:border-box;display:flex;.content-wrap{width:427px;height:100%;z-index:", ";display:flex;flex-direction:column;justify-content:space-between;.h3{line-height:115%;letter-spacing:-1.2px;margin-bottom:20px;}.desc-wrap{display:flex;flex-direction:column;gap:20px;.desc__item{display:flex;align-items:flex-start;.desc__icon{position:relative;width:16px;height:1px;background:rgba(255,255,255,0.6);top:16px;margin-right:12px;}.desc__content{color:#fff;font-size:20px;font-style:normal;font-weight:500;line-height:138%;letter-spacing:-0.6px;.desc__title{font-weight:700;}}}}}.tips-media{width:105px;height:110px;position:relative;}"], N.Z["z-max-img-25"])
          , ex = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-48a2342a-3"
        })([".content-wrap{grid-column:1 / -1;margin-bottom:24px;.text-wrap{.h3{line-height:115%;letter-spacing:-1.2px;margin-bottom:20px;}.desc-wrap{display:flex;flex-direction:column;gap:12px;.desc__item{display:flex;align-items:flex-start;.desc__icon{position:relative;width:12px;height:1px;background:rgba(255,255,255,0.6);top:16px;margin-right:10px;}.desc__content{color:#fff;line-height:138%;letter-spacing:-0.48px;.desc__title{color:#fff;font-size:20px;font-style:normal;font-weight:700;line-height:138%;letter-spacing:-0.6px;}}}}}}"]);
        function ef(e) {
            let {featureGrids: t} = e;
            return (0,
            m.jsx)(m.Fragment, {
                children: (null == t ? void 0 : t.visible) && t.items && (0,
                m.jsxs)(ev, {
                    $layoutWidth: "regular",
                    children: [(0,
                    m.jsx)("h3", {
                        className: "vision-master-max-content-feature-grids-title",
                        children: t.title
                    }), (0,
                    m.jsx)(eo.O, {
                        ...t,
                        isDesktopFlex: t.featuresGridDesktopFlex,
                        isMobileFlex: t.featuresGridMobleFlex,
                        spaceTop: x.c6.none,
                        data: t.items,
                        id: "vision-master-max-content-feature-grids"
                    })]
                })
            })
        }
        let ev = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-215c45b4-0"
        })(["", "{padding-top:20px;}.vision-master-max-content-feature-grids-title{margin-bottom:0;text-align:center;}"], f.Ng);
        (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-215c45b4-1"
        })([""]);
        let eb = e => {
            let {specailIconList: t} = e;
            if (!(0,
            _.Y)(null == t ? void 0 : t.visible))
                return null;
            let {list: i} = t || {};
            return i && (null == i ? void 0 : i.length) ? (0,
            m.jsx)(ew, {
                $grid: !0,
                $layoutWidth: "regular",
                children: (0,
                m.jsx)("div", {
                    className: "icon-list-wrap",
                    children: i.map( (e, t) => (0,
                    m.jsxs)("div", {
                        className: "icon-item",
                        children: [(0,
                        m.jsx)("div", {
                            className: "icon-wrap",
                            children: (0,
                            m.jsx)(y.c, {
                                ...e.topIcon,
                                id: "icon-list-".concat(t, "-icon")
                            })
                        }), (0,
                        m.jsx)("div", {
                            className: "icon-text",
                            children: e.bottomText
                        })]
                    }, "".concat(t, "-").concat(e.bottomText)))
                })
            }) : null
        }
          , ew = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-57a176d4-0"
        })(["position:relative;z-index:", ";height:90px;", "{height:auto;}.icon-list-wrap{grid-column:1 / -1;column-gap:20px;display:flex;", "{flex-wrap:wrap;column-gap:10px;row-gap:20px;}.icon-item{flex:1;display:flex;align-items:center;justify-content:center;flex-direction:column;flex-wrap:wrap;row-gap:8px;", "{flex-basis:calc(50% - 10px);flex-grow:0;column-gap:20px;}.icon-wrap{width:64px;height:64px;position:relative;}.icon-text{color:#fff;text-align:center;font-size:16px;font-style:normal;font-weight:500;line-height:115%;letter-spacing:-0.48px;}}}"], N.Z["z-max-img-25"], f.AB, f.AB, f.AB);
        var ej = i(5670);
        let ey = e => {
            var t, i;
            let {stableAndSmart: n} = e
              , {isMobile: o} = (0,
            w.useContext)(A.t);
            if (!(0,
            _.Y)(null == n ? void 0 : n.visible) || !n)
                return null;
            let a = o ? n.mobileMedia : n.pcMedia
              , l = o ? null === (t = n.mobileMedia) || void 0 === t ? void 0 : t.aspectRatio : null === (i = n.pcMedia) || void 0 === i ? void 0 : i.aspectRatio;
            return (0,
            m.jsxs)(eC, {
                children: [(0,
                m.jsx)("div", {
                    className: "tips label",
                    children: n.tips
                }), void 0 !== o && o && (0,
                m.jsx)(eA, {
                    $grid: !0,
                    $layoutWidth: "regular",
                    children: (0,
                    m.jsxs)("div", {
                        className: "text-wrap",
                        children: [(0,
                        m.jsx)("div", {
                            className: "title h3",
                            children: n.title
                        }), (0,
                        m.jsx)("div", {
                            className: "desc bodyLarge",
                            children: n.desc
                        })]
                    })
                }), (0,
                m.jsxs)(e_, {
                    $aspectRatio: l || "16/9",
                    children: [(0,
                    m.jsx)(y.c, {
                        ...a,
                        id: "stable-and-smart-media"
                    }), void 0 !== o && !o && (0,
                    m.jsx)(eI, {
                        $grid: !0,
                        $layoutWidth: "regular",
                        children: (0,
                        m.jsxs)("div", {
                            className: "text-wrap",
                            children: [(0,
                            m.jsx)("div", {
                                className: "title h3",
                                children: n.title
                            }), (0,
                            m.jsx)("div", {
                                className: "desc bodyLarge",
                                children: n.desc
                            })]
                        })
                    }), (0,
                    m.jsxs)(eN, {
                        $grid: o,
                        $layoutWidth: "regular",
                        children: [(0,
                        m.jsxs)("div", {
                            className: "box-left box-item",
                            children: [(0,
                            m.jsx)("div", {
                                className: "box_title",
                                children: n.leftTitle
                            }), (0,
                            m.jsx)("div", {
                                className: "box_desc",
                                children: n.leftDesc
                            })]
                        }), (0,
                        m.jsxs)("div", {
                            className: "box-right box-item",
                            children: [(0,
                            m.jsx)("div", {
                                className: "box_title",
                                children: n.rightTitle
                            }), (0,
                            m.jsx)("div", {
                                className: "box_desc",
                                children: n.rightDesc
                            })]
                        })]
                    })]
                })]
            })
        }
          , eC = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-2e4a17a0-0"
        })(["", " .tips{margin-bottom:20px;text-align:center;}"], (0,
        f.zD)("padding-top", 60, 80, 120))
          , eI = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-2e4a17a0-1"
        })(["position:absolute;top:0;left:0;width:100%;height:100%;z-index:", ";.text-wrap{grid-column:3 / 11;text-align:center;.title{margin-bottom:21px;line-height:115%;letter-spacing:-1.2px;padding:0 50px;}.desc{}}"], N.Z["z-max-img-25"])
          , eA = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-2e4a17a0-2"
        })(["margin-bottom:-100px;position:relative;z-index:", ";.text-wrap{grid-column:1 / 13;text-align:center;.title{margin-bottom:21px;line-height:115%;}}"], N.Z["z-max-img-25"])
          , eN = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-2e4a17a0-3"
        })(["position:absolute;bottom:80px;left:0;z-index:", ";padding:0 120px;display:flex;column-gap:20px;.box-item{flex:1;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;row-gap:8px;.box_title{color:#edfdfe;text-align:center;text-shadow:0 2px 12px #007bff,0 3px 30px #007bff;font-size:72px;font-style:normal;font-weight:600;line-height:115%;letter-spacing:-2.16px;text-transform:capitalize;}.box_desc{color:#fff;text-align:center;font-size:16px;font-style:normal;font-weight:500;line-height:115%;letter-spacing:-0.48px;white-space:pre-wrap;}}", "{width:100%;}", "{bottom:0;column-gap:10px;padding:0;left:0;right:0;margin:0 auto;.box-item{.box_title{color:#edfdfe;text-align:center;text-shadow:0 2px 12px #007bff,0 3px 30px #007bff;font-size:40px;font-style:normal;font-weight:600;line-height:115%;letter-spacing:-1.2px;text-transform:capitalize;}.box_desc{color:#fff;text-align:center;font-size:16px;font-style:normal;font-weight:500;line-height:115%;letter-spacing:-0.48px;}}}"], N.Z["z-max-img-25"], f.Ng, f.AB)
          , e_ = v.default.div.withConfig({
            componentId: "sc-2e4a17a0-4"
        })(["width:100%;aspect-ratio:", ";position:relative;"], e => {
            let {$aspectRatio: t} = e;
            return t
        }
        );
        var ez = i(39480);
        function ek(e) {
            let {contentStories: t, stories: i} = e;
            return (0,
            m.jsx)(m.Fragment, {
                children: (null == t ? void 0 : t.visible) && i && (0,
                m.jsx)(e$, {
                    $spaceTop: "large",
                    children: (0,
                    m.jsx)(ez.Stories, {
                        ...i,
                        noSpaceBottom: !0
                    })
                })
            })
        }
        let e$ = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-30e8bd9c-0"
        })([""]);
        var eT = i(89754);
        function eS(e) {
            let {storySwitch: t} = e
              , {isMobile: i} = (0,
            w.useContext)(A.t);
            if (!(null == t ? void 0 : t.visible) || !(null == t ? void 0 : t.items))
                return null;
            let n = t.items.map(e => {
                var t;
                return {
                    isMediaContain: !!(null === (t = e.media) || void 0 === t ? void 0 : t.videos),
                    content: (0,
                    m.jsxs)(m.Fragment, {
                        children: [(0,
                        m.jsx)("h4", {
                            children: e.title
                        }), (0,
                        m.jsx)("p", {
                            children: e.description
                        }), e.disclaimer && (0,
                        m.jsx)("small", {
                            className: "muted",
                            children: e.disclaimer
                        })]
                    }),
                    media: e.media
                }
            }
            );
            return (0,
            m.jsx)(eE, {
                $spaceTop: i ? x.c6.medium : void 0,
                children: (0,
                m.jsx)(eT.l, {
                    isReverted: !0,
                    data: n,
                    mediaRatio: "1 / 1",
                    id: "game-features"
                })
            })
        }
        let eE = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-880af6e2-0"
        })(["", "{margin-bottom:-100px;}", "{.slider-columns-visual-container{aspect-ratio:1 / 1;}}"], f.Ng, f.AB);
        var eM = i(2577)
          , eB = i(2602);
        function eD() {
            return (eD = Object.assign ? Object.assign.bind() : function(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var i = arguments[t];
                    for (var n in i)
                        ({}).hasOwnProperty.call(i, n) && (e[n] = i[n])
                }
                return e
            }
            ).apply(null, arguments)
        }
        var eR = function(e) {
            return eB.createElement("svg", eD({
                width: 57,
                height: 56,
                viewBox: "0 0 57 56",
                fill: "none",
                xmlnsXlink: "http://www.w3.org/1999/xlink"
            }, e), eB.createElement("g", {
                clipPath: "url(#subscribe_facebook_svg__a)"
            }, eB.createElement("mask", {
                id: "subscribe_facebook_svg__b",
                style: {
                    maskType: "alpha"
                },
                maskUnits: "userSpaceOnUse",
                x: 0,
                y: 0,
                width: 57,
                height: 56
            }, a || (a = eB.createElement("path", {
                d: "M45.441 2.21a8.85 8.85 0 0 1 8.848 8.849V44.94a8.846 8.846 0 0 1-8.848 8.848H31.707V32.155h6.027l.303-2.293h-6.33v-6.49c0-1.345.282-2.774 1.235-3.879h.001c1.121-1.298 2.843-1.579 4.292-1.579h1.333v-1.792a60 60 0 0 0-2.956-.061c-2.199 0-3.693.628-4.745 1.68v.001c-1.027 1.025-1.678 2.576-1.678 4.964v7.156h-5.83v2.293h5.83V53.79H11.56a8.85 8.85 0 0 1-8.849-8.848V11.06a8.85 8.85 0 0 1 8.849-8.849z",
                stroke: "#fff",
                strokeWidth: 4.421
            }))), l || (l = eB.createElement("g", {
                mask: "url(#subscribe_facebook_svg__b)"
            }, eB.createElement("path", {
                fill: "url(#subscribe_facebook_svg__c)",
                d: "M.5 0H56.5V56H.5z"
            })))), s || (s = eB.createElement("defs", null, eB.createElement("linearGradient", {
                id: "subscribe_facebook_svg__c",
                x1: 28.5,
                y1: 0,
                x2: 28.5,
                y2: 44.911,
                gradientUnits: "userSpaceOnUse"
            }, eB.createElement("stop", {
                stopColor: "#fff"
            }), eB.createElement("stop", {
                offset: 1,
                stopColor: "#999"
            })), eB.createElement("clipPath", {
                id: "subscribe_facebook_svg__a"
            }, eB.createElement("path", {
                fill: "#fff",
                transform: "translate(.5)",
                d: "M0 0H56V56H0z"
            })))))
        };
        let eL = e => {
            var t, i, n, o, a, l, s, r, c, d, p;
            let {data: u} = e;
            if (!(null == u ? void 0 : u.visible))
                return null;
            let {isMobile: h} = (0,
            w.useContext)(A.t)
              , g = h ? (null == u ? void 0 : null === (i = u.imageMobile) || void 0 === i ? void 0 : null === (t = i.image) || void 0 === t ? void 0 : t.src) || "" : (null == u ? void 0 : null === (o = u.image) || void 0 === o ? void 0 : null === (n = o.image) || void 0 === n ? void 0 : n.src) || ""
              , f = h ? null == u ? void 0 : null === (l = u.imageMobile) || void 0 === l ? void 0 : null === (a = l.image) || void 0 === a ? void 0 : a.alt : null == u ? void 0 : null === (r = u.image) || void 0 === r ? void 0 : null === (s = r.image) || void 0 === s ? void 0 : s.alt;
            return (0,
            m.jsx)(eF, {
                $grid: !0,
                $layoutWidth: x.c6.regular,
                $spaceTop: h ? x.c6.regular : x.c6.small,
                children: (0,
                m.jsx)(eP, {
                    children: (0,
                    m.jsxs)(eU, {
                        children: [(0,
                        m.jsx)(eW, {
                            children: (null == u ? void 0 : null === (d = u.image) || void 0 === d ? void 0 : null === (c = d.image) || void 0 === c ? void 0 : c.src) && (0,
                            m.jsx)(y.c, {
                                image: {
                                    src: g,
                                    alt: f,
                                    unoptimized: !0
                                },
                                id: "textWithImageImage"
                            })
                        }), (0,
                        m.jsxs)(eH, {
                            children: [(0,
                            m.jsx)(eO, {
                                children: (0,
                                m.jsx)(eR, {})
                            }), (null == u ? void 0 : u.title) && (0,
                            m.jsx)(eV, {
                                children: null == u ? void 0 : u.title
                            }), (null == u ? void 0 : u.description) && (0,
                            m.jsx)(eY, {
                                children: null == u ? void 0 : u.description
                            }), (null == u ? void 0 : null === (p = u.cta) || void 0 === p ? void 0 : p.text) && (0,
                            m.jsx)(eG, {
                                children: (0,
                                m.jsx)(eM.M, {
                                    isHighlight: !0,
                                    size: x.c6.regular,
                                    onClick: () => {
                                        var e;
                                        (null == u ? void 0 : null === (e = u.cta) || void 0 === e ? void 0 : e.url) && window.open(u.cta.url, "_blank")
                                    }
                                    ,
                                    children: null == u ? void 0 : u.cta.text
                                })
                            })]
                        })]
                    })
                })
            })
        }
          , eF = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-23c9fed5-0"
        })(["", "{padding-top:60px;}"], f.AB)
          , eP = v.default.div.withConfig({
            componentId: "sc-23c9fed5-1"
        })(["grid-column:1 / 13;", "{grid-column:1 / 7;}"], f.AB)
          , eU = v.default.div.withConfig({
            componentId: "sc-23c9fed5-2"
        })(["position:relative;border-radius:20px;background:var(--Background-Secondary,#17191b);display:flex;padding:80px;justify-content:flex-end;align-items:center;gap:20px;", "{flex-direction:column;gap:16px;height:550px;padding:24px 16px;}overflow:hidden;"], f.AB)
          , eW = v.default.div.withConfig({
            componentId: "sc-23c9fed5-3"
        })(["position:absolute;left:0;top:0;bottom:0;", "{width:calc(100% - 460px);height:100%;img{object-fit:cover;object-position:right;}}", "{left:0;top:0;right:0;bottom:inherit;width:100%;height:56%;}"], f.Ng, f.AB);
        v.default.div.withConfig({
            componentId: "sc-23c9fed5-4"
        })(["width:100%;", "{display:none;}"], f.AB),
        v.default.div.withConfig({
            componentId: "sc-23c9fed5-5"
        })(["width:100%;display:none;", "{display:block;}"], f.AB);
        let eH = v.default.div.withConfig({
            componentId: "sc-23c9fed5-6"
        })(["display:flex;flex-direction:column;gap:24px;align-items:center;text-align:center;", "{max-width:379px;}"], f.Ng)
          , eO = v.default.div.withConfig({
            componentId: "sc-23c9fed5-7"
        })(["position:relative;z-index:21;width:56px;height:56px;display:flex;align-items:center;justify-content:center;", "{width:48px;height:48px;}svg{width:100%;height:100%;}"], f.AB)
          , eV = v.default.h4.withConfig({
            componentId: "sc-23c9fed5-8"
        })(["margin-bottom:0;white-space:pre-line;"])
          , eY = v.default.div.withConfig({
            componentId: "sc-23c9fed5-9"
        })(["color:#fff;text-align:center;font-size:20px;font-style:normal;font-weight:500;line-height:138%;letter-spacing:-0.6px;", "{font-size:16px;letter-spacing:-0.48px;}"], f.AB)
          , eG = v.default.div.withConfig({
            componentId: "sc-23c9fed5-10"
        })(["cursor:pointer;"]);
        var eZ = i(16026)
          , eQ = i.n(eZ)
          , eX = i(74126)
          , eJ = i.n(eX)
          , eq = i(1587)
          , eK = i.n(eq)
          , e0 = i(21167)
          , e1 = i.n(e0)
          , e2 = i(32277)
          , e5 = i.n(e2)
          , e6 = i(61297)
          , e4 = {
            src: "/_next/static/media/time_line_1.7a8affad.webp",
            height: 144,
            width: 144,
            blurDataURL: "data:image/webp;base64,UklGRr4AAABXRUJQVlA4WAoAAAAQAAAABwAABwAAQUxQSDwAAAABYBTbVpvL4IAUDxl8xAXJOsbatvuoHpoHmomICEDnANDsEhDDbWvAWGvvEjZrrR2hjS0Uj7W/BpSpUgBWUDggXAAAANABAJ0BKggACAACQDgliAJ0AR9GjPvgAP11Euqn/EtmfpOv8XG0J+9WNVRb780UzuqRDIf9NUE+m+VdUox89rX+rFMRI+KXjzW8VX/NCZETyB2Qd6z8+DHE1QAA",
            blurWidth: 8,
            blurHeight: 8
        }
          , e3 = {
            src: "/_next/static/media/time_line_2.b75e4453.webp",
            height: 144,
            width: 145,
            blurDataURL: "data:image/webp;base64,UklGRsIAAABXRUJQVlA4WAoAAAAQAAAABwAABwAAQUxQSDoAAAABYBvJdponmbkYzNjOpf5nnDHUICwiIiYAyBnPATS3EE8PdxNCiC8thXVtbaO/G2eI7hfi6wAUjBcAVlA4IGIAAACQAgCdASoIAAgAAkA4JQBOgMJV1QD9ADVbTGUmrAD9AZlTdvcfjkg4pK/qFFzN70+6rOJA875z/0q/HWLjlj8AtaIf7J1ta5FhaXgcULFUc6xb/0gcn50HvoeWNIg4zrgAAA==",
            blurWidth: 8,
            blurHeight: 8
        }
          , e8 = {
            src: "/_next/static/media/time_line_3.c40712af.webp",
            height: 144,
            width: 145,
            blurDataURL: "data:image/webp;base64,UklGRsgAAABXRUJQVlA4WAoAAAAQAAAABwAABwAAQUxQSEEAAAAAAAAnCQIvAQAAI9utg9ZPAABP39nn2mwCAO7//////xUAnP/////CAACT/////7oAAIz/////sQAACysxMioQAABWUDggYAAAABACAJ0BKggACAACQDglmAJ0APShz97IOwAA+OXr788vsDMSOk09P0KHp+16vsIYj7YbtarD7QxlZFMKxH2X/w6K/wHt30ub29yVfn40CuByfdedpE5fpdOYmujfZYAAAA==",
            blurWidth: 8,
            blurHeight: 8
        };
        eQ().extend(e5()),
        eQ().extend(e1()),
        eQ().extend(eJ()),
        eQ().extend(eK());
        let e7 = e => eQ()(e).format("MM.DD")
          , e9 = e => {
            let {data: t} = e
              , {isMobile: i} = (0,
            w.useContext)(A.t)
              , n = (0,
            w.useMemo)( () => {
                if (!(null == t ? void 0 : t.items) || 0 === t.items.length)
                    return -1;
                let e = function(e) {
                    let t = 8;
                    if ("number" == typeof e)
                        t = e;
                    else if ("string" == typeof e) {
                        let i = parseInt(e, 10);
                        isNaN(i) || (t = i)
                    }
                    return eQ()().utcOffset(60 * t)
                }(t.timezone);
                return t.items.findIndex(t => {
                    if (!t.startDate || !t.endDate)
                        return !1;
                    let i = eQ()(t.startDate)
                      , n = eQ()(t.endDate).endOf("day");
                    return e.isSameOrAfter(i) && e.isSameOrBefore(n)
                }
                )
            }
            , [null == t ? void 0 : t.items, null == t ? void 0 : t.timezone]);
            return (null == t ? void 0 : t.visible) && (null == t ? void 0 : t.items) && 0 !== t.items.length ? (0,
            m.jsx)(te, {
                $grid: !0,
                $layoutWidth: x.c6.regular,
                $spaceTop: i ? x.c6.medium : x.c6.large,
                children: (0,
                m.jsx)(tt, {
                    children: (0,
                    m.jsx)(ti, {
                        children: t.items.map( (e, t) => (0,
                        m.jsxs)(tn, {
                            $isActive: t === n,
                            children: [(0,
                            m.jsxs)(to, {
                                children: [0 === t && (0,
                                m.jsx)(e6.default, {
                                    width: 48,
                                    height: 48,
                                    src: e4,
                                    alt: "timeline-icon-1"
                                }), 1 === t && (0,
                                m.jsx)(e6.default, {
                                    width: 48,
                                    height: 48,
                                    src: e3,
                                    alt: "timeline-icon-2"
                                }), 2 === t && (0,
                                m.jsx)(e6.default, {
                                    width: 48,
                                    height: 48,
                                    src: e8,
                                    alt: "timeline-icon-3"
                                })]
                            }), (0,
                            m.jsxs)(ta, {
                                children: [e.phaseTitle, " \xa0 | \xa0 ", e7(e.startDate), " –", " ", e7(e.endDate)]
                            }), (0,
                            m.jsx)(tl, {
                                children: e.description
                            })]
                        }, "timeline-item-".concat(t)))
                    })
                })
            }) : null
        }
          , te = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-6e5e7626-0"
        })([""])
          , tt = v.default.div.withConfig({
            componentId: "sc-6e5e7626-1"
        })(["display:flex;flex-direction:column;gap:60px;grid-column:1 / 13;", "{grid-column:1 / 7;gap:30px;}"], f.AB)
          , ti = v.default.div.withConfig({
            componentId: "sc-6e5e7626-2"
        })(["display:grid;grid-template-columns:repeat(3,1fr);gap:20px;", "{grid-template-columns:1fr;gap:16px;}"], f.AB)
          , tn = v.default.div.withConfig({
            componentId: "sc-6e5e7626-3"
        })(["display:flex;flex-direction:column;gap:8px;opacity:", ";transition:opacity 0.3s ease;"], e => e.$isActive ? 1 : .4)
          , to = v.default.div.withConfig({
            componentId: "sc-6e5e7626-4"
        })(["width:48px;height:48px;display:flex;align-items:center;justify-content:center;img{width:100%;height:100%;object-fit:contain;}"])
          , ta = v.default.div.withConfig({
            componentId: "sc-6e5e7626-5"
        })(["color:#fff;font-size:18px;font-style:normal;font-weight:600;line-height:115%;letter-spacing:-0.54px;"])
          , tl = v.default.div.withConfig({
            componentId: "sc-6e5e7626-6"
        })(["color:#fff;font-size:16px;font-style:normal;font-weight:500;line-height:138%;letter-spacing:-0.48px;"]);
        var ts = i(91401)
          , tr = i(12437)
          , tc = i.n(tr)
          , td = i(32582)
          , tp = i(29651);
        let tu = {
            emailFormatError: "Invalid email format.",
            emailAlreadySubmitted: "This email has already participated in the draw. Please check again.",
            allPrizesClaimed: "Too late! All prizes have been claimed.",
            ipLargeThanThree: "You have already participated in the draw 3 times. Please try again later.",
            otherError: "Draw failed. Please try again later."
        }
          , tm = [ts.b7.de, ts.b7.fr || "fr"]
          , th = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        function tg() {
            return (tg = Object.assign ? Object.assign.bind() : function(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var i = arguments[t];
                    for (var n in i)
                        ({}).hasOwnProperty.call(i, n) && (e[n] = i[n])
                }
                return e
            }
            ).apply(null, arguments)
        }
        var tx = function(e) {
            return eB.createElement("svg", tg({
                width: 12,
                height: 8,
                viewBox: "0 0 12 8",
                fill: "none"
            }, e), r || (r = eB.createElement("path", {
                d: "M11 6.5 6.33 1.642a.46.46 0 0 0-.66 0L1 6.5",
                stroke: "#F2F2F2",
                strokeWidth: 1.5,
                strokeLinecap: "round"
            })))
        };
        let tf = e => {
            let {rules: t, title: i="Rules", isExpanded: n, onToggle: o} = e
              , [a,l] = (0,
            w.useState)(!1)
              , [s,r] = (0,
            w.useState)(0)
              , c = (0,
            w.useRef)(null)
              , d = void 0 !== n ? n : a;
            return (0,
            w.useEffect)( () => {
                c.current && r(c.current.scrollHeight + 22 + 22)
            }
            , [t]),
            (0,
            m.jsxs)(tv, {
                $expanded: d,
                $contentHeight: s,
                children: [(0,
                m.jsxs)("button", {
                    type: "button",
                    className: "expandable-rules__toggle",
                    onClick: () => {
                        let e = !d;
                        void 0 === n && l(e),
                        null == o || o(e)
                    }
                    ,
                    "aria-expanded": d,
                    children: [(0,
                    m.jsx)("span", {
                        className: "expandable-rules__title small",
                        children: i
                    }), (0,
                    m.jsx)(tx, {
                        className: "expandable-rules__icon ".concat(d ? "expanded" : "")
                    })]
                }), (0,
                m.jsx)("div", {
                    className: "expandable-rules__content",
                    ref: c,
                    children: (0,
                    m.jsx)("ul", {
                        className: "expandable-rules__list",
                        children: t.map(e => (0,
                        m.jsxs)("li", {
                            className: "expandable-rules__item small",
                            children: [(0,
                            m.jsx)("span", {
                                className: "expandable-rules__li-marker",
                                children: "\xb7"
                            }), (0,
                            m.jsx)("span", {
                                className: "expandable-rules__li-text",
                                children: e.text
                            })]
                        }, e.id))
                    })
                })]
            })
        }
          , tv = v.default.div.withConfig({
            componentId: "sc-342d97a4-0"
        })(["height:", ";transition:height ", ";overflow:hidden;.expandable-rules__toggle{", "{cursor:pointer;&:hover{.expandable-rules__title{color:var(--Minor,#5ca6d6);}.expandable-rules__icon{path{stroke:var(--Minor,#5ca6d6);}}}}}.expandable-rules__title{margin-right:8px;}.expandable-rules__icon{transform:rotate(180deg);transition:transform 0.3s ease-in-out;&.expanded{transform:rotate(0deg);}}.expandable-rules__content{ul{margin:0;padding:0;list-style:none;li{margin-top:8px;display:flex;.expandable-rules__li-marker{margin-right:8px;font-size:32px;font-weight:700;}}}}"], e => e.$expanded ? "".concat(e.$contentHeight, "px") : "".concat(22, "px"), e => e.$expanded ? "0.4s ease-in" : "0.3s ease-out", f.Ng);
        var tb = i(76103)
          , tw = i(98417)
          , tj = i(92405);
        let ty = e => {
            var t, i, n;
            let {align: o="left", buttonText: a="Subscribe", email: l="", isLoading: s=!1, errorMessage: r="Please enter a valid email address.", placeholder: c="your@email.com", privacyPolicyTextStyle: d, onEmailChange: p, onSubmit: u} = e
              , {subscription: h} = (0,
            w.useContext)(A.t)
              , {isMobile: g} = (0,
            w.useContext)(A.t)
              , x = (0,
            w.useMemo)( () => {
                try {
                    return !!l && !s && th.test(l)
                } catch (e) {
                    return !1
                }
            }
            , [l, s]);
            return (0,
            m.jsxs)(tC, {
                onSubmit: e => {
                    e.preventDefault(),
                    null == u || u()
                }
                ,
                $align: o,
                className: "subscription-form__form-container",
                children: [(0,
                m.jsxs)(tI, {
                    className: "subscription-form__input-group",
                    children: [(0,
                    m.jsx)(tw.II, {
                        $size: "regular",
                        type: "email",
                        placeholder: c || "your@email.com",
                        disabled: s,
                        value: l,
                        onChange: e => null == p ? void 0 : p(e.target.value)
                    }), void 0 !== g && !g && (0,
                    m.jsx)(tA, {
                        id: "turnplate-card-submit-btn",
                        type: "submit",
                        className: "subClickTrack",
                        disabled: s,
                        $hasInputText: !!l,
                        "data-event": x ? "datavisionmaster_spin_submit_Click" : "",
                        children: (0,
                        m.jsxs)(eM.M, {
                            size: "regular",
                            isHighlight: !0,
                            children: [(0,
                            m.jsx)(t_, {
                                style: {
                                    opacity: s ? 0 : 1
                                },
                                children: a || (null == h ? void 0 : null === (t = h.general) || void 0 === t ? void 0 : t.cta)
                            }), s && (0,
                            m.jsx)(tb.Z, {})]
                        })
                    })]
                }), r && (0,
                m.jsx)(tN, {
                    className: "muted tiny error",
                    children: r
                }), void 0 !== g && g && (0,
                m.jsx)(tA, {
                    id: "turnplate-card-submit-btn",
                    type: "submit",
                    className: "subClickTrack",
                    disabled: s,
                    $hasInputText: !!l,
                    children: (0,
                    m.jsxs)(eM.M, {
                        size: "regular",
                        isHighlight: !0,
                        children: [(0,
                        m.jsx)(t_, {
                            style: {
                                opacity: s ? 0 : 1
                            },
                            children: a || (null == h ? void 0 : null === (i = h.general) || void 0 === i ? void 0 : i.cta)
                        }), s && (0,
                        m.jsx)(tb.Z, {})]
                    })
                }), (0,
                m.jsx)("small", {
                    className: "muted tiny privacy-policy_wrap",
                    children: (0,
                    m.jsx)(tj.V, {
                        data: (null == h ? void 0 : null === (n = h.general) || void 0 === n ? void 0 : n.consent) || [],
                        privacyPolicyTextStyle: d
                    })
                })]
            })
        }
          , tC = v.default.form.withConfig({
            componentId: "sc-1165270a-0"
        })(["display:flex;flex-direction:column;align-items:", ";gap:4px;padding:0;small{margin-top:8px;opacity:1;width:100%;text-align:left;", "{text-align:left;}&.error{p{color:#ff0000;br{display:none;}}}p{margin-top:0;display:inline-block;margin-bottom:0;color:rgba(255,255,255,0.4);a{color:#009afe;}}}#turnplate-card-submit-btn{.cta-pill{min-width:108px;}", "{margin-top:8px;flex-basis:100%;width:100%;height:44px;.cta-pill{width:100%;}}}"], e => e.$align || "center", f.AB, f.AB)
          , tI = v.default.div.withConfig({
            componentId: "sc-1165270a-1"
        })(["display:flex;gap:0.5rem;width:100%;input{flex-grow:1;background:#fff;color:#000;width:300px;}"])
          , tA = v.default.button.withConfig({
            componentId: "sc-1165270a-2"
        })(["border:none;background:none;cursor:pointer;padding:0;.cta-background--self{background:", ";}"], e => e.$hasInputText ? "hsl(204, 100%, 50%)" : "#666")
          , tN = v.default.small.withConfig({
            componentId: "sc-1165270a-3"
        })(["color:#dc3545;font-size:0.75rem;text-align:left;"])
          , t_ = v.default.span.withConfig({
            componentId: "sc-1165270a-4"
        })(["transition:opacity 0.4s ease;"])
          , tz = e => {
            let {successInfo: t, sanitySuccessInfo: i} = e
              , [n,o] = (0,
            w.useState)(!1);
            if (!t)
                return null;
            let {copyText: a, successCopyText: l, tipText: s, titleSuccess: r} = i
              , {discountCode: c} = t
              , d = async () => {
                try {
                    await navigator.clipboard.writeText(c),
                    o(!0),
                    setTimeout( () => {
                        o(!1)
                    }
                    , 3e3)
                } catch (t) {
                    let e = document.createElement("textarea");
                    e.value = c,
                    document.body.appendChild(e),
                    e.select(),
                    document.execCommand("copy"),
                    document.body.removeChild(e),
                    o(!0),
                    setTimeout( () => {
                        o(!1)
                    }
                    , 3e3)
                }
            }
            ;
            return (0,
            m.jsxs)(tk, {
                children: [(0,
                m.jsxs)(tT, {
                    children: [r, " ", (0,
                    m.jsxs)("span", {
                        children: ["“", t.prizeName, "”"]
                    })]
                }), (0,
                m.jsxs)(tS, {
                    children: [(0,
                    m.jsxs)("div", {
                        className: "top",
                        children: [(0,
                        m.jsx)("div", {
                            className: "top-input-text",
                            children: (0,
                            m.jsx)("span", {
                                className: "top-input-text-code",
                                children: c
                            })
                        }), (0,
                        m.jsx)("div", {
                            className: "top-input-button",
                            onClick: d,
                            "data-event": n ? "" : "visionmaster_spin_copy_Click",
                            children: (0,
                            m.jsx)(eM.M, {
                                size: "regular",
                                isHighlight: !0,
                                children: n ? l : a
                            })
                        })]
                    }), (0,
                    m.jsx)("div", {
                        className: "bottom",
                        children: (0,
                        m.jsx)("div", {
                            className: "bottom-tip-text small",
                            children: t.userNote
                        })
                    })]
                }), (0,
                m.jsx)(t$, {
                    children: (0,
                    m.jsx)("div", {
                        className: "bottom-tip-text tiny",
                        children: s
                    })
                })]
            })
        }
          , tk = v.default.div.withConfig({
            componentId: "sc-f7acf7e8-0"
        })(["display:flex;row-gap:32px;flex-direction:column;"])
          , t$ = v.default.div.withConfig({
            componentId: "sc-f7acf7e8-1"
        })(["line-height:138%;letter-spacing:-0.33px;white-space:pre-wrap;opacity:0.4;"])
          , tT = v.default.h3.withConfig({
            componentId: "sc-f7acf7e8-2"
        })(["color:var(--Text-Primary,#f2f2f2);margin:0;span{color:#f7b15e;}"])
          , tS = v.default.div.withConfig({
            componentId: "sc-f7acf7e8-3"
        })([".top{display:flex;justify-content:flex-start;align-items:center;gap:8px;", "{flex-direction:column;flex-wrap:wrap;}.top-input-text{flex-basis:300px;flex-shrink:0;display:flex;height:44px;padding:8px 20px;justify-content:center;align-items:center;border-radius:50px;background:#fff;color:#000;font-size:16px;font-style:normal;font-weight:800;line-height:115%;letter-spacing:-0.48px;", "{flex-basis:44px;width:100%;height:44px;}.top-input-text-code{&.text-copied{background-color:#007aff;color:white;}}}.top-input-button{", "{flex-basis:100%;width:100%;height:44px;margin-top:4px;.cta-pill{width:100%;}}cursor:pointer;.cta-pill{min-width:108px;}}}.bottom{.bottom-tip-text{margin-top:8px;line-height:138%;letter-spacing:-0.48px;}}"], f.AB, f.AB, f.AB);
        function tE() {
            return (tE = Object.assign ? Object.assign.bind() : function(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var i = arguments[t];
                    for (var n in i)
                        ({}).hasOwnProperty.call(i, n) && (e[n] = i[n])
                }
                return e
            }
            ).apply(null, arguments)
        }
        var tM = function(e) {
            return eB.createElement("svg", tE({
                width: 24,
                height: 24,
                viewBox: "0 0 24 24",
                fill: "none",
                xmlnsXlink: "http://www.w3.org/1999/xlink"
            }, e), c || (c = eB.createElement("path", {
                d: "M16.883 4.345A23.1 23.1 0 0 1 8.252 6h-.75a5.25 5.25 0 0 0-.88 10.427A21.6 21.6 0 0 0 8 20.367c.464 1.004 1.674 1.32 2.582.796l.657-.379c.88-.508 1.165-1.593.772-2.468a17 17 0 0 1-.628-1.607c1.918.258 3.76.75 5.5 1.446a21.7 21.7 0 0 0 1.119-6.905c0-2.414-.393-4.735-1.12-6.905m1.379-.605a23.2 23.2 0 0 1 1.24 7.51 23.2 23.2 0 0 1-1.41 7.992.752.752 0 0 0 1.02.939.75.75 0 0 0 .389-.423 24.6 24.6 0 0 0 1.415-6.43 3 3 0 0 0 .836-2.078c0-.807-.32-1.54-.836-2.078a24.7 24.7 0 0 0-1.415-6.43.749.749 0 0 0-1.385-.057.75.75 0 0 0-.024.573q.089.24.17.482",
                fill: "url(#radio_svg__a)"
            })), d || (d = eB.createElement("defs", null, eB.createElement("linearGradient", {
                id: "radio_svg__a",
                x1: 8.5,
                y1: 8,
                x2: 12,
                y2: 21,
                gradientUnits: "userSpaceOnUse"
            }, eB.createElement("stop", {
                stopColor: "#F7B457"
            }), eB.createElement("stop", {
                offset: .505,
                stopColor: "#FD5587"
            }), eB.createElement("stop", {
                offset: 1,
                stopColor: "#C25CE1"
            })))))
        };
        let tB = e => {
            let {tips: t} = e;
            return (0,
            m.jsxs)(tD, {
                children: [(0,
                m.jsx)(tM, {
                    className: "tips-right-top__radio"
                }), (0,
                m.jsx)("div", {
                    className: "tips-right-top__text body-medium",
                    children: t
                }), (0,
                m.jsx)("div", {
                    className: "glass-filter"
                }), (0,
                m.jsx)("div", {
                    className: "glass-overlay"
                }), (0,
                m.jsx)("div", {
                    className: "glass-specular"
                })]
            })
        }
          , tD = v.default.div.withConfig({
            componentId: "sc-feb9ccc4-0"
        })(["display:flex;width:200px;box-sizing:border-box;padding:8px;align-items:flex-start;gap:8px;border-radius:10px;overflow:hidden;", "{position:absolute;right:8px;top:8px;}", "{width:calc(100vw - 16px);position:relative;margin:0 auto;top:unset;right:unset;margin-bottom:16px;}.tips-right-top__radio{width:24px;height:24px;flex-shrink:0;aspect-ratio:1/1;}.tips-right-top__text{line-height:138%;letter-spacing:-0.48px;}> *:not(.glass-filter):not(.glass-overlay):not(.glass-specular){position:relative;z-index:10;}.glass-filter{position:absolute;inset:0;z-index:1;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);}.glass-overlay{position:absolute;inset:0;z-index:2;background:rgba(255,255,255,0.05);}.glass-specular{position:absolute;inset:0;z-index:3;border-radius:inherit;overflow:hidden;box-shadow:inset 0px 1px 0 rgba(255,255,255,0.3),inset 0 0 2px rgba(255,255,255,0.2);}"], f.Ng, f.AB)
          , tR = e => {
            let {title: t, isMobile: i} = e;
            return (0,
            m.jsx)(tL, {
                className: i ? "h4" : "",
                children: t
            })
        }
          , tL = v.default.h2.withConfig({
            componentId: "sc-2d75cc98-0"
        })(["margin:0;", "{line-height:115%;letter-spacing:-0.72px;}"], f.AB);
        var tF = i(79718)
          , tP = i(9560);
        let tU = () => ({
            createSubscription: (0,
            w.useCallback)(async e => {
                let {email: t, successInfo: i, locale: n} = e;
                try {
                    await (0,
                    tP.w)(t, ["VisionMasterMax_subscriptionTag", ts.ob[n] || ""]);
                    let e = [ts.Ng.de, ts.Ng.fr].includes(n) ? "VBdUEJ" : "RyzSFc"
                      , o = [ts.Ng.de, ts.Ng.fr].includes(n) ? "R2au2c" : "VRd9ZW";
                    return await (0,
                    tF.Sq)({
                        custormSource: "valerion_spinwinner",
                        email: t,
                        listId: o,
                        publicApiKey: e,
                        tags: ["VisionMasterMax_subscriptionTag", ts.ob[n] || ""],
                        otherInfo: {
                            shopify_tags_self: ["VisionMasterMax_subscriptionTag", ts.ob[n] || ""],
                            prizeName: null == i ? void 0 : i.prizeName,
                            prizeCode: null == i ? void 0 : i.discountCode,
                            userNote: null == i ? void 0 : i.userNote,
                            locale: n,
                            site: "Valerion_".concat(n.toUpperCase())
                        }
                    }),
                    {
                        success: !0
                    }
                } catch (e) {
                    return console.error("create subscription error:", e),
                    {
                        success: !1,
                        error: e
                    }
                }
            }
            , [])
        })
          , tW = () => {
            let e = (0,
            w.useRef)(null)
              , t = (0,
            w.useRef)(0)
              , i = (0,
            w.useCallback)(function(i) {
                let n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 6;
                return new Promise( (o, a) => {
                    try {
                        var l;
                        if (!e.current) {
                            a(Error("turnplate element not found"));
                            return
                        }
                        let s = 360 / n
                          , r = (t.current % 360 + 360) % 360
                          , c = t.current + (10 + Math.floor(3 * Math.random())) * 360 + (360 + s / 2 - (((i - 1) % n + n) % n * s + s / 2) + 0 - r) % 360;
                        e.current.style.willChange = "transform",
                        e.current.style.transition = "transform 7.5s cubic-bezier(0.25, 0.1, 0.25, 1)",
                        e.current.style.transform = "rotate(".concat(c, "deg)");
                        let d = () => {
                            if (t.current = c,
                            e.current) {
                                var i;
                                e.current.style.transition = "",
                                e.current.style.willChange = "",
                                null === (i = e.current) || void 0 === i || i.removeEventListener("transitionend", d)
                            }
                            o()
                        }
                        ;
                        null === (l = e.current) || void 0 === l || l.addEventListener("transitionend", d)
                    } catch (e) {
                        a(e)
                    }
                }
                )
            }, []);
            return {
                turnplateRef: e,
                rotationRef: t,
                rotateTurnplate: i
            }
        }
          , tH = e => {
            let[t,i] = (0,
            w.useState)("")
              , [n,o] = (0,
            w.useState)("");
            return {
                email: t,
                errorMessage: n,
                onEmailChange: (0,
                w.useCallback)(e => {
                    i(e),
                    o("")
                }
                , []),
                validateEmail: (0,
                w.useCallback)(t => t && th.test(t) ? null : e.emailFormatError, [e]),
                setErrorMessage: o
            }
        }
        ;
        (n = p || (p = {})).en = "en",
        n.de = "de",
        n.fr = "fr",
        (o = u || (u = {}))[o.SUCCESS = 0] = "SUCCESS",
        o[o.EMAIL_ALREADY_SUBMITTED = 1] = "EMAIL_ALREADY_SUBMITTED",
        o[o.IP_LARGE_THAN_THREE = 2] = "IP_LARGE_THAN_THREE",
        o[o.ALL_PRIZES_CLAIMED = 3] = "ALL_PRIZES_CLAIMED";
        let tO = e => {
            var t, i, n, o;
            let {turnplateCard: a, locale: l} = e
              , s = (0,
            _.Y)(null == a ? void 0 : a.visible);
            if (!a || !s)
                return null;
            let r = {
                ...tu,
                ...null == a ? void 0 : a.inputErrorTips
            }
              , {isMobile: c} = (0,
            w.useContext)(A.t)
              , [d,p] = (0,
            w.useState)(!1)
              , [h,g] = (0,
            w.useState)(!1)
              , [f,v] = (0,
            w.useState)(null)
              , [b,j] = (0,
            w.useState)([])
              , {fetchData: C, loading: I} = (0,
            tp.Z)()
              , {turnplateRef: N, rotateTurnplate: z} = tW()
              , {createSubscription: k} = tU()
              , {email: $, errorMessage: T, onEmailChange: S, setErrorMessage: E, validateEmail: M} = tH(r);
            (0,
            w.useEffect)( () => {
                B()
            }
            , []);
            let B = async () => {
                var e, t, i;
                let n = await C({
                    path: td.l5.path,
                    method: td.l5.method,
                    query: {
                        pageSize: 100,
                        pageNum: 1,
                        activityId: 2
                    }
                });
                n && 200 === n.code && (null == n ? void 0 : null === (e = n.data) || void 0 === e ? void 0 : e.code) === 200 && j((null == n ? void 0 : null === (i = n.data) || void 0 === i ? void 0 : null === (t = i.rows) || void 0 === t ? void 0 : t.sort( (e, t) => e.id - t.id)) || [])
            }
              , D = () => {
                if (E(""),
                I || d)
                    return;
                if (!b || 0 === b.length) {
                    E(r.allPrizesClaimed),
                    console.error("not request api, because giftPrizeList is empty");
                    return
                }
                let e = M($);
                if (e) {
                    E(e);
                    return
                }
                R()
            }
              , R = async () => {
                try {
                    var e, t;
                    let i = await C({
                        path: td.mI.path,
                        method: td.mI.method,
                        body: {
                            email: $,
                            activityId: 2,
                            locale: "SITE_".concat(l.toLocaleUpperCase()),
                            encryptValue: function(e, t, i) {
                                let n = tc().createCipheriv("aes-128-cbc", t, i)
                                  , o = n.update(e, "utf8", "base64");
                                return o += n.final("base64")
                            }($, "valerionijklmnop", "1314567890123456")
                        }
                    });
                    if (i && 200 === i.code && (null == i ? void 0 : null === (e = i.data) || void 0 === e ? void 0 : e.status) === u.SUCCESS) {
                        p(!0);
                        let e = F((null == i ? void 0 : i.data) || null);
                        if (!e || e < 1 || e > b.length) {
                            p(!1),
                            E(r.otherError);
                            return
                        }
                        try {
                            await z(e, b.length),
                            p(!1),
                            g(!0)
                        } catch (e) {
                            console.error("trunplate animation error:", e),
                            p(!1),
                            E(r.otherError)
                        }
                        return
                    }
                    switch (p(!1),
                    null == i ? void 0 : null === (t = i.data) || void 0 === t ? void 0 : t.status) {
                    case u.EMAIL_ALREADY_SUBMITTED:
                        E(r.emailAlreadySubmitted);
                        break;
                    case u.IP_LARGE_THAN_THREE:
                        E(r.ipLargeThanThree);
                        break;
                    case u.ALL_PRIZES_CLAIMED:
                        E(r.allPrizesClaimed);
                        break;
                    default:
                        E(r.otherError)
                    }
                } catch (e) {
                    E(r.otherError)
                }
            }
              , L = e => tm.includes(e) ? e : ts.b7.en
              , F = e => {
                let {prizeName: t, discountCode: i, prizeId: n, userNote: o} = e || {};
                if (!t || !i || !n || !o)
                    return -1;
                let a = b.findIndex(e => e.id === n);
                if (a < 0)
                    return -1;
                let s = b[a]
                  , r = s.languages.find(e => e.language === L(l))
                  , c = {
                    ...s,
                    ...e,
                    prizeName: (null == r ? void 0 : r.prizeName) || t,
                    userNote: (null == r ? void 0 : r.userNote) || o
                };
                return k({
                    email: $,
                    successInfo: c,
                    locale: l
                }),
                v(c),
                a + 1
            }
            ;
            return void 0 !== c && c ? (0,
            m.jsxs)(tY, {
                $bgcImg: (null == a ? void 0 : null === (o = a.mobileBackgroundMedia) || void 0 === o ? void 0 : null === (n = o.image) || void 0 === n ? void 0 : n.src) || "",
                children: [(0,
                m.jsx)("div", {
                    id: "TurnplateCardId",
                    className: "turnplate-card-id-container"
                }), (0,
                m.jsxs)("div", {
                    className: "mobile-top-container",
                    children: [(0,
                    m.jsx)(tB, {
                        tips: a.rightTopTips
                    }), (0,
                    m.jsxs)("div", {
                        className: "mobile-top-container__turnplate",
                        children: [(0,
                        m.jsx)("div", {
                            className: "mobile-top-container__turnplate-content",
                            ref: N,
                            children: (0,
                            m.jsx)(y.c, {
                                ...a.mobileMediaTurnplate,
                                id: "turnplate-card-turnplate"
                            })
                        }), (0,
                        m.jsx)("div", {
                            className: "mobile-top-container__pointer",
                            children: (0,
                            m.jsx)(y.c, {
                                ...a.mobileMediaPointer,
                                id: "turnplate-card-pointer"
                            })
                        }), (0,
                        m.jsx)("div", {
                            className: "mobile-top-container__center",
                            children: (0,
                            m.jsx)(y.c, {
                                ...a.mobileMediaCenter,
                                id: "turnplate-card-pointer-center"
                            })
                        })]
                    }), (0,
                    m.jsx)("div", {
                        className: "mobile-top-container__tray",
                        children: (0,
                        m.jsx)(y.c, {
                            ...a.mobileMediaTray,
                            id: "turnplate-card-tray"
                        })
                    })]
                }), h ? (0,
                m.jsx)(tG, {
                    $layoutWidth: x.c6.regular,
                    children: (0,
                    m.jsx)(tz, {
                        successInfo: f,
                        sanitySuccessInfo: a.successInfo
                    })
                }) : (0,
                m.jsxs)(m.Fragment, {
                    children: [(0,
                    m.jsx)(tG, {
                        $layoutWidth: x.c6.regular,
                        children: (0,
                        m.jsx)(tR, {
                            title: a.leftTitle,
                            isMobile: !0
                        })
                    }), (0,
                    m.jsx)(tG, {
                        $layoutWidth: x.c6.regular,
                        children: (0,
                        m.jsx)(ty, {
                            align: "left",
                            placeholder: a.leftInputPlaceholder,
                            isLoading: I || d,
                            buttonText: a.leftInputButtonText,
                            email: $,
                            onEmailChange: S,
                            onSubmit: D,
                            errorMessage: T
                        })
                    }), (0,
                    m.jsx)(tG, {
                        $layoutWidth: x.c6.regular,
                        children: (0,
                        m.jsx)(tf, {
                            rules: (a.leftRulesList || []).map(e => ({
                                id: e,
                                text: e
                            })),
                            title: a.leftRulesTitle
                        })
                    })]
                })]
            }) : (0,
            m.jsxs)(tV, {
                className: "turnplate-card-container",
                $layoutWidth: x.c6.regular,
                $bgcImg: (null == a ? void 0 : null === (i = a.pcBackgroundMedia) || void 0 === i ? void 0 : null === (t = i.image) || void 0 === t ? void 0 : t.src) || "",
                children: [(0,
                m.jsx)("div", {
                    id: "TurnplateCardId",
                    className: "turnplate-card-id-container"
                }), (0,
                m.jsx)("div", {
                    className: "left-container",
                    children: h ? (0,
                    m.jsx)(tz, {
                        successInfo: f,
                        sanitySuccessInfo: a.successInfo
                    }) : (0,
                    m.jsxs)(m.Fragment, {
                        children: [(0,
                        m.jsx)(tR, {
                            title: a.leftTitle
                        }), (0,
                        m.jsx)(ty, {
                            align: "left",
                            placeholder: a.leftInputPlaceholder,
                            isLoading: I || d,
                            buttonText: a.leftInputButtonText,
                            email: $,
                            onEmailChange: S,
                            onSubmit: D,
                            errorMessage: T
                        }), (0,
                        m.jsx)(tf, {
                            rules: (a.leftRulesList || []).map(e => ({
                                id: e,
                                text: e
                            })),
                            title: a.leftRulesTitle
                        })]
                    })
                }), (0,
                m.jsxs)("div", {
                    className: "right-container",
                    children: [(0,
                    m.jsxs)("div", {
                        className: "top-turnplate",
                        children: [(0,
                        m.jsx)("div", {
                            className: "top-turnplate__content",
                            id: "turnplate-card-turnplate-content",
                            ref: N,
                            children: (0,
                            m.jsx)(y.c, {
                                ...a.pcMediaTurnplate,
                                id: "turnplate-card-turnplate"
                            })
                        }), (0,
                        m.jsx)("div", {
                            className: "pointer-container",
                            children: (0,
                            m.jsx)(y.c, {
                                ...a.pcMediaPointer,
                                id: "turnplate-card-pointer"
                            })
                        }), (0,
                        m.jsx)("div", {
                            className: "center-container",
                            children: (0,
                            m.jsx)(y.c, {
                                ...a.pcMediaCenter,
                                id: "turnplate-card-pointer-center",
                                videoProps: {
                                    loop: !0,
                                    muted: !0,
                                    autoPlay: !0
                                }
                            })
                        })]
                    }), (0,
                    m.jsx)("div", {
                        className: "bottom-tray",
                        children: (0,
                        m.jsx)(y.c, {
                            ...a.pcMediaTray,
                            id: "turnplate-card-tray"
                        })
                    })]
                }), (0,
                m.jsx)(tB, {
                    tips: a.rightTopTips
                })]
            })
        }
          , tV = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-3f0bc653-0"
        })(["margin-top:40px;background-image:url(", ");background-size:cover;background-position:center;background-repeat:no-repeat;background-color:#313336;border-radius:20px;overflow:hidden;", " padding-top:40px;padding-bottom:40px;display:flex;justify-content:space-between;min-height:608px;position:relative;box-sizing:border-box;.turnplate-card-id-container{position:absolute;top:-20px;left:0;}.left-container{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:start;row-gap:32px;", "}.right-container{flex-basis:608px;display:flex;flex-direction:column;justify-content:center;align-items:center;.top-turnplate{width:459px;height:459px;margin-bottom:-44px;position:relative;z-index:", ";&__content{position:absolute;top:0;left:0;width:100%;height:100%;}}.pointer-container{position:absolute;width:60px;height:45px;top:-5px;left:0;right:0;margin:0 auto;z-index:", ";}.center-container{position:absolute;top:138px;left:0;right:0;margin:0 auto;z-index:", ";width:185px;height:185px;border-radius:50%;overflow:hidden;.pointer-center-container{position:absolute;top:32px;left:0;right:0;margin:0 auto;width:156px;height:156px;}}.bottom-tray{width:480px;height:100px;position:relative;}}"], e => {
            let {$bgcImg: t} = e;
            return t
        }
        , (0,
        f.zD)("padding", 24, 48, 72), (0,
        f.zD)("padding-right", 50, 80, 160), N.Z["z-max-img-25"], N.Z["z-max-img-25"], N.Z["z-max-img-25"])
          , tY = v.default.div.withConfig({
            componentId: "sc-3f0bc653-1"
        })(["margin-top:40px;background-image:url(", ");background-size:cover;background-position:0 0;background-repeat:no-repeat;background-color:#313336;width:100vw;min-height:750px;position:relative;padding:16px 0px 32px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:32px;.turnplate-card-id-container{position:absolute;top:-20px;left:0;}.mobile-top-container{width:100%;position:relative;margin-top:-8px;.mobile-top-container__turnplate{position:relative;width:346px;height:346px;margin:0 auto;margin-bottom:-30px;z-index:", ";&-content{position:absolute;top:0;left:0;width:100%;height:100%;}}.mobile-top-container__pointer{position:absolute;top:-6px;left:0;right:0;margin:0 auto;width:40px;height:30px;}.mobile-top-container__center{position:absolute;width:138px;height:138px;border-radius:50%;overflow:hidden;top:104px;left:0;right:0;margin:0 auto;}.mobile-top-container__tray{position:relative;width:366px;height:76px;margin:0 auto;}}"], e => {
            let {$bgcImg: t} = e;
            return t
        }
        , N.Z["z-max-img-25"])
          , tG = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-3f0bc653-2"
        })([""]);
        var tZ = i(63890);
        function tQ(e) {
            let {featureGrids: t} = e;
            return (0,
            m.jsx)(m.Fragment, {
                children: (null == t ? void 0 : t.visible) && t.items && (0,
                m.jsxs)(tX, {
                    $layoutWidth: "regular",
                    children: [(0,
                    m.jsx)("h3", {
                        className: "vision-master-max-content-feature-grids-title",
                        children: t.title
                    }), (0,
                    m.jsx)(eo.O, {
                        ...t,
                        isDesktopFlex: t.featuresGridDesktopFlex,
                        isMobileFlex: t.featuresGridMobleFlex,
                        spaceTop: x.c6.medium,
                        data: t.items,
                        id: "vision-master-max-content-feature-grids"
                    })]
                })
            })
        }
        let tX = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-23b500c6-0"
        })([".vision-master-max-content-feature-grids-title{margin-bottom:0;text-align:center;}"]);
        function tJ(e) {
            var t;
            let {locale: i, visionMasterMaxSanityData: n, stories: o} = e;
            return (0,
            m.jsx)(m.Fragment, {
                children: n.content && (0,
                m.jsxs)(tq, {
                    children: [(0,
                    m.jsx)(K, {
                        iconsCarousel: n.content.iconsCarouselIfa,
                        spaceTop: x.c6.small
                    }), (0,
                    m.jsx)(ei, {
                        mediaReviews: n.content.mediaReviews
                    }), (0,
                    m.jsx)(e9, {
                        data: n.content.timeline
                    }), (0,
                    m.jsx)(tO, {
                        turnplateCard: n.content.turnplateCard,
                        locale: i
                    }), (0,
                    m.jsx)(eL, {
                        data: n.content.textWithImage
                    }), (0,
                    m.jsx)(ea, {
                        featureGrids: n.content.reimaginedFeaturesGrid
                    }), (0,
                    m.jsx)(tZ.x, {
                        visualSpecs: n.content.visualSpecs,
                        visualSpecsMobile: n.content.visualSpecsMobile,
                        noSpaceBottom: !0
                    }), (0,
                    m.jsx)(b.c, {
                        projectorParameter: null === (t = n.footer) || void 0 === t ? void 0 : t.projectorParameter,
                        spaceTop: x.c6.large
                    }), (0,
                    m.jsx)(es, {
                        screenPlays: n.content.screenPlays,
                        screenPlaysBottomInfo: n.content.screenPlaysBottomInfo
                    }), (0,
                    m.jsx)(S.B, {
                        dark: n.content.dark
                    }), (0,
                    m.jsx)(ey, {
                        stableAndSmart: n.content.stableAndSmart
                    }), (0,
                    m.jsx)(U, {
                        eblStep: n.content.eblStep
                    }), (0,
                    m.jsx)(W, {
                        flawlessDarkScene: n.content.flawlessDarkScene
                    }), (0,
                    m.jsx)(tK, {
                        children: (0,
                        m.jsx)(eb, {
                            specailIconList: n.content.specailIconList
                        })
                    }), (0,
                    m.jsx)(ej.i, {
                        dark: n.content.speckleDark
                    }), (0,
                    m.jsx)(tQ, {
                        featureGrids: n.content.watchingBetterFeatureGrids
                    }), (0,
                    m.jsx)(G, {
                        HDRHideDetail: n.content.HDRHideDetail
                    }), (0,
                    m.jsx)(J.s, {
                        featureGrids: n.content.homeTheaterFeaturesGrid
                    }), (0,
                    m.jsx)(g.$, {
                        screen: n.content.homeTheaterScreen
                    }), (0,
                    m.jsx)(z, {
                        connectEverything: n.content.connectEverything
                    }), (0,
                    m.jsx)(eS, {
                        storySwitch: n.content.storySwitch
                    }), (0,
                    m.jsx)(eu, {
                        sleekAndInnovativeDesign: n.content.sleekAndInnovativeDesign
                    }), (0,
                    m.jsx)(ef, {
                        featureGrids: n.content.sleekInnovativeFeaturesGrids
                    }), (0,
                    m.jsx)(ek, {
                        contentStories: n.content.stories,
                        stories: o
                    }), (0,
                    m.jsx)(K, {
                        iconsCarousel: n.content.iconsCarousel,
                        spaceTop: x.c6.large
                    })]
                })
            })
        }
        (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-23b500c6-1"
        })([""]);
        let tq = (0,
        v.default)(h.Container).withConfig({
            componentId: "sc-5e833456-0"
        })([".vision-master-max-content-feature-grids-title{white-space:pre-line;text-shadow:0 2px 4px rgba(0,0,0,0.15);background:linear-gradient(180deg,#fff 0%,#999 80.2%);background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent;}.story-switch-render-data-column{grid-column:1 / 5;}.story-switch-render-images-column{grid-column:6 / 13;}.number-row-item{", "{gap:0;justify-content:center;}}", "{.number-row-item:nth-last-of-type(-n + 2){.logs-row-image-container{height:18vw;}}}.visual-specs-container{", "{row-gap:40px;}", "{row-gap:24px;}}"], f.Ng, f.AB, f.Ng, f.AB)
          , tK = v.default.div.withConfig({
            componentId: "sc-5e833456-1"
        })(["margin-top:-90px;", "{margin-top:60px;}"], f.AB)
    },
    99854: function(e, t, i) {
        "use strict";
        i.d(t, {
            VisionMasterMaxFooter: function() {
                return z
            }
        });
        var n = i(11183)
          , o = i(40912)
          , a = i(59173)
          , l = i(11178)
          , s = i(97570)
          , r = i(15142)
          , c = i(71707)
          , d = i(50017);
        function p(e) {
            let {detailParameter: t} = e
              , {setSecondNavCurrent: i} = (0,
            l.useContext)(c.x)
              , {ref: o, inView: a} = (0,
            s.YD)({
                threshold: 0
            });
            return (null == t ? void 0 : t.visible) ? ((0,
            l.useEffect)( () => {
                a && i("specs")
            }
            , [a]),
            (0,
            n.jsxs)(n.Fragment, {
                children: [(0,
                n.jsx)(u, {
                    ref: o,
                    children: (0,
                    n.jsx)("div", {
                        className: "inner-target",
                        id: "techSpecs"
                    })
                }), (0,
                n.jsx)(r.n, {
                    id: "specs",
                    detailParameter: t,
                    spaceTop: "large",
                    noSpaceBottom: !0,
                    buttonGtmData: {
                        buttonOneGtmData: {
                            eventName: "visionmaster_compare"
                        },
                        buttonTwoGtmData: {
                            eventName: "visionmaster_compare"
                        }
                    }
                })]
            })) : (0,
            n.jsx)(n.Fragment, {})
        }
        let u = (0,
        a.default)(o.Container).withConfig({
            componentId: "sc-7d32ebe8-0"
        })(["", " ", " display:flex;align-items:flex-end;justify-content:flex-start;.inner-target{width:100%;}"], (0,
        d.zD)("height", 50, 100, 150), (0,
        d.zD)("margin-bottom", -50, -100, -150));
        var m = i(206);
        function h(e) {
            let {faq: t} = e;
            return (0,
            n.jsx)(n.Fragment, {
                children: (null == t ? void 0 : t.visible) && (0,
                n.jsx)(g, {
                    $spaceTop: "large",
                    $layoutWidth: "regular",
                    children: (0,
                    n.jsx)(m.B, {
                        spaceBottom: "none",
                        title: null == t ? void 0 : t.title,
                        data: null == t ? void 0 : t.data
                    })
                })
            })
        }
        let g = (0,
        a.default)(o.Container).withConfig({
            componentId: "sc-8b68c527-0"
        })([""]);
        var x = i(2577)
          , f = i(51046)
          , v = i(39193);
        let b = e => {
            let {data: t} = e;
            return (null == t ? void 0 : t.visible) && (null == t ? void 0 : t.countryList) && 0 !== t.countryList.length ? (0,
            n.jsx)(w, {
                $grid: !0,
                $layoutWidth: f.c6.regular,
                $spaceTop: f.c6.extraLarge,
                children: (0,
                n.jsxs)(j, {
                    children: [(0,
                    n.jsx)(y, {
                        className: "h3",
                        children: t.title || "Shop Location"
                    }), t.countryList.map( (e, t) => (0,
                    n.jsxs)(C, {
                        children: [e.countryTitle && (0,
                        n.jsx)(I, {
                            className: "bodyMedium",
                            children: e.countryTitle
                        }), e.stores && e.stores.length > 0 && (0,
                        n.jsx)(A, {
                            children: e.stores.map( (e, i) => (0,
                            n.jsx)(N, {
                                children: (0,
                                n.jsx)(_, {
                                    "data-click-url": (0,
                                    v.M)(e.url),
                                    "data-event": "visionmaster_dealershop_click",
                                    onClick: () => {
                                        e.url && window.open(e.url, "_blank")
                                    }
                                    ,
                                    children: (0,
                                    n.jsx)(x.M, {
                                        mode: "default",
                                        children: e.name
                                    })
                                })
                            }, "store-".concat(t, "-").concat(i)))
                        })]
                    }, "country-".concat(t)))]
                })
            }) : null
        }
          , w = (0,
        a.default)(o.Container).withConfig({
            componentId: "sc-94b82d5f-0"
        })([""])
          , j = a.default.div.withConfig({
            componentId: "sc-94b82d5f-1"
        })(["display:flex;flex-direction:column;gap:60px;grid-column:1 / 13;", "{grid-column:1 / 7;gap:30px;}"], d.AB)
          , y = a.default.h2.withConfig({
            componentId: "sc-94b82d5f-2"
        })(["margin-bottom:0px;"])
          , C = a.default.div.withConfig({
            componentId: "sc-94b82d5f-3"
        })(["display:flex;flex-direction:column;gap:20px;&:last-child{margin-bottom:0;}"])
          , I = a.default.h5.withConfig({
            componentId: "sc-94b82d5f-4"
        })(["margin-bottom:0px;"])
          , A = a.default.div.withConfig({
            componentId: "sc-94b82d5f-5"
        })(["display:flex;gap:0.75em;"])
          , N = a.default.div.withConfig({
            componentId: "sc-94b82d5f-6"
        })(["display:flex;column-gap:20px;"])
          , _ = a.default.button.withConfig({
            componentId: "sc-94b82d5f-7"
        })(["background:none;border:none;padding:0;cursor:pointer;&:focus{outline:none;}&:focus-visible{outline:2px solid #009afe;outline-offset:2px;}"]);
        function z(e) {
            let {visionMasterMaxSanityData: t} = e
              , {footer: i} = t;
            return (0,
            n.jsx)(n.Fragment, {
                children: i && (0,
                n.jsxs)(k, {
                    $spaceBottom: "large",
                    children: [(0,
                    n.jsx)(p, {
                        detailParameter: i.detailParameter
                    }), (0,
                    n.jsx)(h, {
                        faq: i.faq
                    }), (0,
                    n.jsx)(b, {
                        data: i.shopLocation
                    })]
                })
            })
        }
        let k = (0,
        a.default)(o.Container).withConfig({
            componentId: "sc-d1e8e26f-0"
        })([""])
    },
    62355: function(e, t, i) {
        "use strict";
        i.d(t, {
            VisionMasterMaxHeader: function() {
                return x
            }
        });
        var n = i(11183)
          , o = i(11178)
          , a = i(40912)
          , l = i(43289)
          , s = i(34764);
        function r(e) {
            let {isCompensateHeader: t, media: i, mediaMobile: a} = e
              , {isMobile: r} = (0,
            o.useContext)(s.t);
            return (0,
            n.jsx)(n.Fragment, {
                children: void 0 !== r && (r ? (0,
                n.jsx)(l.c, {
                    ...a,
                    videoProps: {
                        loop: !1
                    },
                    videoEndedHidden: !0,
                    id: "ManCaveHeader-mediaMobile"
                }) : (0,
                n.jsx)(l.c, {
                    ...i,
                    videoProps: {
                        loop: !1
                    },
                    videoEndedHidden: !0,
                    id: "ManCaveHeader-mediaDesktop"
                }))
            })
        }
        var c = i(38157)
          , d = i(2577)
          , p = i(50017)
          , u = i(59173);
        function m(e) {
            let {isCompensateHeader: t, title: i, tip: o, subTitle: a, buyNowText: l, buyNowUrl: s, bottomTip: r} = e;
            return (0,
            n.jsx)(h, {
                $isCompensateHeader: t,
                children: (0,
                n.jsx)(g, {
                    $grid: !0,
                    children: (0,
                    n.jsxs)("div", {
                        className: "content-container",
                        children: [i && (0,
                        n.jsx)("h1", {
                            className: "h3 content-title",
                            children: i
                        }), o && (0,
                        n.jsx)("small", {
                            className: "content-tip",
                            children: o
                        }), a && (0,
                        n.jsx)("h2", {
                            className: "bodyLarge content-sub-title",
                            children: a
                        }), (0,
                        n.jsx)(n.Fragment, {
                            children: s && (0,
                            n.jsx)(c.default, {
                                "data-event": "visionmasterpro2_banner_click",
                                className: "buy-now-button",
                                href: s,
                                children: (0,
                                n.jsx)(d.M, {
                                    children: l
                                })
                            })
                        }), (0,
                        n.jsx)("div", {
                            className: "bottom-tip",
                            children: r
                        })]
                    })
                })
            })
        }
        let h = (0,
        u.default)(a.Container).withConfig({
            componentId: "sc-8a9411fa-0"
        })(["position:relative;z-index:20;height:100%;width:100%;", ";", "{padding:0 60px;}"], (0,
        p.zD)("padding-top", 72, 80, 86), p.Ng)
          , g = (0,
        u.default)(a.Container).withConfig({
            componentId: "sc-8a9411fa-1"
        })(["height:100%;text-align:center;.buy-now-button{margin-top:24px;cursor:pointer;}.buy-now-empty{margin-top:0em;height:0em;}.content-container{.content-tip{padding-top:8px;text-transform:none;}.bottom-tip{position:absolute;bottom:16px;right:60px;color:rgba(255,255,255,0.4);text-align:right;font-size:11px;font-style:normal;font-weight:500;line-height:138%;letter-spacing:-0.33px;", "{width:100%;left:50%;right:unset;bottom:24px;transform:translateX(-50%);text-align:center;}}}", "{.content-container{grid-column:1 / 6;display:flex;flex-direction:column;justify-content:center;align-items:center;align-self:stretch;padding-bottom:60px;.content-title{margin-bottom:0;}.content-tip{}.content-sub-title{", ";white-space:pre-line;margin-top:24px;margin-bottom:0;text-align:center;}}}", "{.content-container{grid-column:1 / 7;display:flex;flex-direction:column;align-items:center;padding:56px 0;max-width:calc(100% - 32px);margin-left:auto;margin-right:auto;.content-title{margin-top:auto;line-height:1.1em;margin-bottom:0;}.content-sub-title{width:320px;margin-top:16px;margin-bottom:0;}.buy-now-button{margin-top:20px;}}}"], p.AB, p.Ng, (0,
        p.zD)("width", 360, 500, 460), p.AB);
        function x(e) {
            let {isCompensateHeader: t, visionMasterMaxSanityData: i} = e
              , {isMobile: a} = (0,
            o.useContext)(s.t)
              , {header: l} = i;
            return void 0 === a ? null : (0,
            n.jsx)(n.Fragment, {
                children: l && (0,
                n.jsxs)(f, {
                    $isCompensateHeader: t,
                    $layoutWidth: "medium",
                    $isMobile: a,
                    children: [(0,
                    n.jsx)(r, {
                        media: l.media,
                        mediaMobile: l.mediaMobile
                    }), (0,
                    n.jsx)(m, {
                        title: l.title,
                        subTitle: l.subTitle,
                        tip: l.tip,
                        buyNowText: l.buyNowText,
                        buyNowUrl: l.buyNowUrl,
                        bottomTip: l.bottomTip
                    })]
                })
            })
        }
        let f = (0,
        u.default)(a.Container).withConfig({
            componentId: "sc-bec03ed6-0"
        })(["position:relative;height:100svh;", "{box-sizing:border-box;.media-render-container{top:-20px;}}", ""], p.AB, e => e.$isCompensateHeader && (0,
        u.css)(["", "{", ";}", "{", ";", ";}"], p.Ng, (0,
        p.zD)("margin-top", -144, -160, -172), p.AB, (0,
        p.zD)("margin-top", -177, -193, -205), (0,
        p.zD)("padding-top", 72, 80, 86)))
    },
    401: function(e, t, i) {
        "use strict";
        i.d(t, {
            VisionMasterMaxSecondNav: function() {
                return h
            }
        });
        var n = i(11183)
          , o = i(38157)
          , a = i(11178)
          , l = i(2577)
          , s = i(27474)
          , r = i(40912)
          , c = i(34764)
          , d = i(60557)
          , p = i(9778)
          , u = i(59173)
          , m = i(71707);
        function h(e) {
            var t, i;
            let {visionMasterMaxSanityData: r, gtmData: d} = e
              , {isMobile: u} = (0,
            a.useContext)(c.t)
              , {secondNavCurrent: h, setSecondNavCurrent: f} = (0,
            a.useContext)(m.x)
              , {secondNav: v} = r
              , b = (0,
            a.useRef)(null);
            function w(e) {
                return "MobileSecondRow".concat(e, "Id")
            }
            return (0,
            a.useEffect)( () => {
                h && function(e) {
                    var t, i;
                    if (null == v ? void 0 : null === (t = v.navItems) || void 0 === t ? void 0 : t.length) {
                        let t = 0;
                        for (let n = 0; n < (null == v ? void 0 : null === (i = v.navItems) || void 0 === i ? void 0 : i.length); n++) {
                            let i = v.navItems[n];
                            if (null == i ? void 0 : i.url) {
                                if ((null == i ? void 0 : i.url) === e)
                                    break;
                                let n = document.getElementById(w(i.url));
                                n && (t += n.getBoundingClientRect().width)
                            }
                        }
                        b.current && b.current.scrollTo({
                            left: t > 0 ? t - 100 : t,
                            behavior: "smooth"
                        })
                    }
                }(h)
            }
            , [h]),
            (0,
            n.jsx)(n.Fragment, {
                children: v && void 0 !== u && (0,
                n.jsx)(n.Fragment, {
                    children: (0,
                    n.jsx)(s.z, {
                        navItemActiveDesign: !0,
                        visibleOffsetTop: 494,
                        title: v.title,
                        minorNav: !1 === u ? null === (t = v.navItems) || void 0 === t ? void 0 : t.map(e => ({
                            label: e.label,
                            onClick: () => {
                                (0,
                                p.c)(e.url),
                                f(e.url)
                            }
                            ,
                            isActive: h === e.url
                        })) : [],
                        ctaArea: (0,
                        n.jsx)(n.Fragment, {
                            children: v.buyNowUrl && (v.buyNowUrl.includes("/") ? (0,
                            n.jsx)(o.default, {
                                "data-event": null == d ? void 0 : d.eventName,
                                className: "buy-now-button",
                                href: v.buyNowUrl,
                                children: (0,
                                n.jsx)(l.M, {
                                    size: !0 === u ? "small" : void 0,
                                    children: v.buyNowText
                                })
                            }) : (0,
                            n.jsx)("button", {
                                className: "buy-now-button",
                                onClick: () => (0,
                                p.c)(v.buyNowUrl),
                                "data-event": null == d ? void 0 : d.eventName,
                                children: (0,
                                n.jsx)(l.M, {
                                    size: !0 === u ? "small" : void 0,
                                    children: v.buyNowText
                                })
                            }))
                        }),
                        mobileSecondRow: (0,
                        n.jsx)(n.Fragment, {
                            children: u && v.navItems && (0,
                            n.jsx)(g, {
                                ref: b,
                                children: null === (i = v.navItems) || void 0 === i ? void 0 : i.map( (e, t) => e.url ? (0,
                                n.jsx)(x, {
                                    className: "label",
                                    id: w(e.url),
                                    $navItemActive: h === e.url,
                                    onClick: () => {
                                        (0,
                                        p.c)(e.url),
                                        f(e.url)
                                    }
                                    ,
                                    children: e.label
                                }, "secondLevelNav-mobile-second-row-".concat(e.url)) : null)
                            })
                        })
                    })
                })
            })
        }
        let g = (0,
        u.default)(r.Container).withConfig({
            componentId: "sc-2641d46-0"
        })(["padding:0 20px 12px 0;white-space:nowrap;overflow:auto;button{padding-left:20px;}"])
          , x = u.default.button.withConfig({
            componentId: "sc-2641d46-1"
        })(["", ""], e => e.$navItemActive && (0,
        u.css)(["color:", ";"], d.$_.whiteDescription))
    },
    2365: function(e, t, i) {
        "use strict";
        i.d(t, {
            pR: function() {
                return x
            }
        });
        var n = i(11183)
          , o = i(75086)
          , a = i(84126)
          , l = i(96828)
          , s = i.n(l)
          , r = i(61297)
          , c = i(11178)
          , d = i(97570)
          , p = i(40912)
          , u = i(51046)
          , m = i(34764)
          , h = i(50017)
          , g = i(59173);
        let x = e => {
            let {isMobile: t} = (0,
            c.useContext)(m.t)
              , i = (0,
            c.useRef)(null)
              , l = (0,
            c.useRef)(null)
              , {ref: h, inView: g} = (0,
            d.YD)({
                threshold: 0
            });
            return (0,
            o.V)( () => {
                if (void 0 === t || !d.df)
                    return;
                a.ZP.registerPlugin(s());
                let e = l.current;
                a.ZP.timeline({
                    paused: !0,
                    scrollTrigger: {
                        trigger: i.current,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: .4
                    }
                }).fromTo(e, {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
                }, {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
                    immediateRender: !0,
                    ease: "linear"
                }, 0)
            }
            , {
                scope: i,
                revertOnUpdate: !0,
                dependencies: [t, g]
            }),
            (0,
            n.jsx)(n.Fragment, {
                children: (0,
                n.jsx)(p.Container, {
                    $spaceTop: e.spaceTop || u.c6.large,
                    ref: h,
                    children: (0,
                    n.jsx)(I, {
                        ref: i,
                        children: (0,
                        n.jsx)(C, {
                            children: (0,
                            n.jsxs)(y, {
                                children: [(0,
                                n.jsxs)(j, {
                                    children: [(0,
                                    n.jsxs)(b, {
                                        $isBottomAligned: !0,
                                        children: [e.value2 && (0,
                                        n.jsx)(f, {
                                            children: e.value2
                                        }), e.caption && (0,
                                        n.jsx)("h2", {
                                            className: "h4 description-text",
                                            children: e.caption
                                        }), e.bottomLeftTitle && e.bottomRightTitle && (0,
                                        n.jsxs)(w, {
                                            className: "contrast-label-multiple-content",
                                            $layoutWidth: t ? "regular" : void 0,
                                            children: [(0,
                                            n.jsxs)("div", {
                                                className: "multile-content-inner",
                                                children: [(0,
                                                n.jsx)("div", {
                                                    className: "multile-content-inner-title",
                                                    children: e.bottomLeftTitle
                                                }), (0,
                                                n.jsx)("div", {
                                                    className: "multile-content-inner-description",
                                                    children: e.bottomLeftDescription
                                                })]
                                            }), (0,
                                            n.jsxs)("div", {
                                                className: "multile-content-inner",
                                                children: [(0,
                                                n.jsx)("div", {
                                                    className: "multile-content-inner-title",
                                                    children: e.bottomRightTitle
                                                }), (0,
                                                n.jsx)("div", {
                                                    className: "multile-content-inner-description",
                                                    children: e.bottomRightDescription
                                                })]
                                            })]
                                        })]
                                    }), void 0 !== t && (t ? e.dark02MobileUrl && (0,
                                    n.jsx)(r.default, {
                                        src: e.dark02MobileUrl,
                                        sizes: "100vw",
                                        fill: !0,
                                        alt: e.imgAlt || "",
                                        quality: 90,
                                        priority: !0
                                    }, "darkImage02mobile") : e.dark02DesktopUrl && (0,
                                    n.jsx)(r.default, {
                                        src: e.dark02DesktopUrl,
                                        sizes: "100vw",
                                        fill: !0,
                                        alt: e.imgAlt || "",
                                        quality: 90,
                                        priority: !0
                                    }, "darkImage02"))]
                                }), (0,
                                n.jsxs)(j, {
                                    ref: l,
                                    children: [(0,
                                    n.jsxs)(b, {
                                        className: "contrast-label",
                                        children: [e.value1 && (0,
                                        n.jsx)(v, {
                                            className: "h2 contrast-label-title",
                                            children: e.value1
                                        }), e.disclaimer && (0,
                                        n.jsx)("div", {
                                            className: "disclaimer-text",
                                            children: e.disclaimer
                                        })]
                                    }), void 0 !== t && (t ? e.dark01MobileUrl && (0,
                                    n.jsx)(r.default, {
                                        src: e.dark01MobileUrl,
                                        sizes: "100vw",
                                        fill: !0,
                                        alt: e.imgAlt || "",
                                        quality: 90,
                                        priority: !0
                                    }, "darkImage01mobile") : e.dark01DesktopUrl && (0,
                                    n.jsx)(r.default, {
                                        src: e.dark01DesktopUrl,
                                        sizes: "100vw",
                                        fill: !0,
                                        alt: e.imgAlt || "",
                                        quality: 90,
                                        priority: !0
                                    }, "darkImage01"))]
                                })]
                            })
                        })
                    })
                })
            })
        }
          , f = g.default.div.withConfig({
            componentId: "sc-cd6a0d7d-0"
        })(["", ";line-height:1.15em;letter-spacing:-0.04em;font-weight:600;margin-bottom:0.5em;"], (0,
        h.zD)("font-size", 48, 120, 190))
          , v = g.default.div.withConfig({
            componentId: "sc-cd6a0d7d-1"
        })(["", " line-height:1.15em;letter-spacing:-0.04em;font-weight:600;"], (0,
        h.zD)("font-size", 48, 120, 190))
          , b = (0,
        g.default)(p.Container).withConfig({
            componentId: "sc-cd6a0d7d-2"
        })(["position:absolute;left:0;width:100%;text-align:center;", " z-index:20;h2{margin:0;}p{opacity:0.6;}h4{margin-bottom:0;}.disclaimer-text{color:#fff;text-align:center;", "{", ";}", "{", ";}font-style:normal;font-weight:600;line-height:115%;letter-spacing:-0.96px;white-space:pre-line;}.description-text{white-space:pre-line;}"], e => e.$isBottomAligned ? (0,
        g.css)(["bottom:6em;", "{bottom:4em;}"], h.AB) : (0,
        g.css)(["top:0;", " ", "{", ";top:0;}"], (0,
        h.zD)("padding-top", 40, 40, 40), h.AB, (0,
        h.zD)("padding-top", 24, 24, 24)), h.Ng, (0,
        h.zD)("font-size", 32, 32, 32), h.AB, (0,
        h.zD)("font-size", 24, 24, 24))
          , w = (0,
        g.default)(p.Container).withConfig({
            componentId: "sc-cd6a0d7d-3"
        })(["display:flex;align-items:center;", "{padding:0 8%;}.multile-content-inner{flex:1;.multile-content-inner-title{", ";font-weight:bold;text-shadow:0 2px 12px #007bff,0 3px 30px #007bff;color:#edfdfe;line-height:1.15em;}.multile-content-inner-description{line-height:1.15em;", ";", ";font-weight:bold;}}"], h.Ng, (0,
        h.zD)("font-size", 40, 72, 82), (0,
        h.zD)("padding-top", 4, 8, 10), (0,
        h.zD)("font-size", 20, 32, 40))
          , j = g.default.div.withConfig({
            componentId: "sc-cd6a0d7d-4"
        })(["position:absolute;z-index:30;left:0;top:0;width:100%;height:100%;> img{z-index:2;}"])
          , y = g.default.div.withConfig({
            componentId: "sc-cd6a0d7d-5"
        })(["position:absolute;left:0;top:0;width:100%;height:100%;z-index:1;img{object-fit:cover;}"])
          , C = g.default.div.withConfig({
            componentId: "sc-cd6a0d7d-6"
        })(["top:0;position:sticky;height:100lvh;width:100%;"])
          , I = g.default.div.withConfig({
            componentId: "sc-cd6a0d7d-7"
        })(["height:200lvh;position:relative;z-index:10;"])
    },
    22529: function(e, t, i) {
        "use strict";
        i.d(t, {
            k: function() {
                return g
            }
        });
        var n = i(11183)
          , o = i(84126)
          , a = i(96828)
          , l = i.n(a)
          , s = i(61297)
          , r = i(11178)
          , c = i(97570)
          , d = i(40912)
          , p = i(51046)
          , u = i(34764)
          , m = i(50017)
          , h = i(59173);
        let g = e => {
            var t;
            let {isMobile: i} = (0,
            r.useContext)(u.t)
              , {ref: a, inView: m} = (0,
            c.YD)({
                threshold: 0
            })
              , h = (0,
            r.useRef)(null)
              , g = (0,
            r.useRef)(null)
              , A = (0,
            r.useRef)(null)
              , N = (0,
            r.useRef)(null);
            return (0,
            r.useEffect)( () => {
                var t;
                if (!m)
                    return;
                o.p8.registerPlugin(l());
                let i = h.current
                  , n = g.current
                  , a = A.current
                  , s = N.current
                  , r = o.p8.timeline({
                    paused: !0,
                    scrollTrigger: {
                        trigger: i,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: .4
                    }
                }).fromTo(n, {
                    clipPath: "polygon(0% 13%, 100% 13%, 100% 87%, 0% 87%)",
                    opacity: 1
                }, {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    opacity: 1,
                    duration: 2
                }, 0).fromTo(a, {
                    opacity: 0
                }, {
                    opacity: 1,
                    duration: 1
                }, 1);
                return e.contentSize && r.fromTo(a, {
                    opacity: 1
                }, {
                    opacity: 0,
                    duration: 1.5,
                    immediateRender: !1
                }, 2).fromTo(n, {
                    opacity: 1
                }, {
                    opacity: .4,
                    duration: 1.5,
                    immediateRender: !1
                }, 2).fromTo(n, {
                    opacity: .4
                }, {
                    opacity: 1,
                    duration: 1,
                    immediateRender: !1
                }, 4),
                (null === (t = e.sizeImage) || void 0 === t ? void 0 : t.src) && r.fromTo(s, {
                    opacity: 0
                }, {
                    opacity: 1,
                    duration: 1
                }, 4).fromTo(s, {
                    opacity: 1
                }, {
                    opacity: 1,
                    duration: .5,
                    immediateRender: !1
                }, 5),
                () => {
                    r.clear(),
                    r.scrollTrigger && r.scrollTrigger.kill()
                }
            }
            , [m]),
            (0,
            n.jsxs)(d.Container, {
                ref: h,
                $spaceBottom: p.c6.huge,
                children: [(0,
                n.jsx)(C, {
                    $grid: !0,
                    $layoutWidth: p.c6.regular,
                    children: (0,
                    n.jsx)(I, {
                        children: (0,
                        n.jsx)(d.ContentColumn, {
                            className: i ? void 0 : "bodyLarge",
                            children: e.contentImax
                        })
                    })
                }), (0,
                n.jsxs)(j, {
                    ref: a,
                    children: [(0,
                    n.jsx)(y, {
                        children: (0,
                        n.jsx)(w, {
                            children: (0,
                            n.jsxs)(b, {
                                children: [(0,
                                n.jsxs)(f, {
                                    ref: g,
                                    children: [e.contentImage && (0,
                                    n.jsx)(s.default, {
                                        src: e.contentImage.src,
                                        sizes: e.contentImage.sizes,
                                        fill: !0,
                                        alt: e.contentImage.alt || "",
                                        priority: !0
                                    }), e.imaxImage && (0,
                                    n.jsx)(x, {
                                        src: e.imaxImage.src,
                                        sizes: e.imaxImage.sizes,
                                        fill: !0,
                                        alt: "",
                                        priority: !0,
                                        ref: A
                                    }), (null === (t = e.sizeImage) || void 0 === t ? void 0 : t.src) && (0,
                                    n.jsx)(x, {
                                        src: e.sizeImage.src,
                                        sizes: e.sizeImage.sizes,
                                        fill: !0,
                                        alt: "",
                                        priority: !0,
                                        ref: N
                                    })]
                                }), (0,
                                n.jsx)(v, {
                                    children: e.seatsImage && (0,
                                    n.jsx)(s.default, {
                                        src: e.seatsImage.src,
                                        sizes: e.seatsImage.sizes,
                                        fill: !0,
                                        alt: "",
                                        priority: !0
                                    })
                                })]
                            })
                        })
                    }), e.contentSize && (0,
                    n.jsx)(C, {
                        $grid: !0,
                        $layoutWidth: p.c6.regular,
                        $offset: 1.25,
                        children: (0,
                        n.jsx)(I, {
                            children: (0,
                            n.jsx)(d.ContentColumn, {
                                className: i ? void 0 : "bodyLarge",
                                children: e.contentSize
                            })
                        })
                    })]
                })]
            })
        }
          , x = (0,
        h.default)(s.default).withConfig({
            componentId: "sc-468d3e40-0"
        })(["opacity:0;"])
          , f = h.default.div.withConfig({
            componentId: "sc-468d3e40-1"
        })(["position:absolute;left:0;top:0;width:100%;height:100%;"])
          , v = h.default.div.withConfig({
            componentId: "sc-468d3e40-2"
        })(["position:absolute;", "{", "}", "{aspect-ratio:344 / 64;height:auto;}", " width:var(--fullWidth,100vw);left:50%;transform:translateX(-50%);top:100%;img{object-fit:cover;object-position:50% 0%;}"], m.AB, (0,
        m.zD)("height", 120, 120, null), m.Ng, (0,
        m.zD)("margin-top", 30, 30, 50))
          , b = h.default.div.withConfig({
            componentId: "sc-468d3e40-3"
        })(["aspect-ratio:1.9 / 1;width:100%;height:auto;position:relative;@container imaxSizeCssContainer (min-aspect-ratio:1.9 / 1){width:auto;height:100%;}"])
          , w = h.default.div.withConfig({
            componentId: "sc-468d3e40-4"
        })(["position:absolute;display:flex;justify-content:center;align-items:center;left:50%;top:47.5%;transform:translate(-50%,-50%);height:70lvh;width:90vw;container:imaxSizeCssContainer / size;"])
          , j = h.default.div.withConfig({
            componentId: "sc-468d3e40-5"
        })(["height:363lvh;margin-top:-13lvh;", "{margin:-26lvh 0;}"], m.AB)
          , y = h.default.div.withConfig({
            componentId: "sc-468d3e40-6"
        })(["height:100lvh;position:sticky;top:0;"])
          , C = (0,
        h.default)(d.Container).withConfig({
            componentId: "sc-468d3e40-7"
        })(["position:relative;z-index:20;", ""], e => e.$offset && (0,
        h.css)(["margin-top:", "lvh;"], 100 * e.$offset))
          , I = (0,
        h.default)(d.Container).withConfig({
            componentId: "sc-468d3e40-8"
        })(["text-align:center;grid-column:3 / 11;", "{grid-column:1 / 7;}"], m.AB)
    },
    25953: function(e, t, i) {
        "use strict";
        i.d(t, {
            R: function() {
                return d
            }
        });
        var n = i(11183)
          , o = i(60794)
          , a = i(51046)
          , l = i(50017)
          , s = i(59173)
          , r = i(40912)
          , c = i(94262);
        let d = e => (0,
        n.jsx)(u, {
            children: (0,
            n.jsx)(h, {
                $layoutWidth: a.c6.regular,
                $spaceBottom: e.isDisabledBottomSpace ? void 0 : "medium",
                $grid: !0,
                children: (0,
                n.jsxs)(m, {
                    $contentWide: e.contentWide,
                    $fullUp: e.fullUp,
                    children: [e.title && (0,
                    n.jsx)("h2", {
                        className: "h3",
                        children: (0,
                        n.jsx)(o.Y, {
                            text: e.title,
                            id: "".concat(e.id, "-title")
                        })
                    }), (0,
                    n.jsx)(p, {
                        className: "title-section-sub-title--self",
                        children: (0,
                        n.jsx)(o.Y, {
                            text: e.subTitle,
                            id: "".concat(e.id, "-subTitle")
                        })
                    })]
                })
            })
        })
          , p = s.default.h3.withConfig({
            componentId: "sc-ef85e571-0"
        })(["", ";"], (0,
        l.zD)("font-size", 36, 100, 190))
          , u = s.default.div.withConfig({
            componentId: "sc-ef85e571-1"
        })(["overflow:hidden;"])
          , m = s.default.div.withConfig({
            componentId: "sc-ef85e571-2"
        })(["grid-column:1 / 7;", "{grid-column:", ";}h2{margin:0;}"], l.Ng, e => e.$fullUp ? "1 / 13 " : e.$contentWide ? "1 / 12" : "2 / 12")
          , h = (0,
        s.default)(r.Container).withConfig({
            componentId: "sc-ef85e571-3"
        })(["text-align:center;h2{margin-bottom:0.5em;}[data-type='line']{", "}"], c.Zt)
    },
    32582: function(e, t, i) {
        "use strict";
        i.d(t, {
            Jw: function() {
                return o
            },
            Qw: function() {
                return n
            },
            l5: function() {
                return a
            },
            mI: function() {
                return l
            }
        });
        let n = {
            path: "/system/valerionProductRating/list",
            method: "GET"
        }
          , o = {
            path: "/system/valerionAccessoriesBack/validateOrderNumber",
            method: "GET"
        }
          , a = {
            path: "/system/wheelLotteryPrize/list",
            method: "GET"
        }
          , l = {
            path: "/system/wheelLotteryWinning/prizeDraw",
            method: "POST"
        }
    },
    29651: function(e, t, i) {
        "use strict";
        var n = i(11178);
        t.Z = function() {
            let[e,t] = (0,
            n.useState)(!1)
              , [i,o] = (0,
            n.useState)(null)
              , [a,l] = (0,
            n.useState)(null);
            return {
                loading: e,
                data: i,
                error: a,
                fetchData: async e => {
                    let {path: i, query: n, body: a={}, method: s="POST"} = e;
                    t(!0),
                    l(null),
                    o(null);
                    try {
                        let e = i + function(e) {
                            if (!e)
                                return "";
                            let t = Object.entries(e).filter(e => {
                                let[t,i] = e;
                                return null != i
                            }
                            ).map(e => {
                                let[t,i] = e;
                                return "".concat(encodeURIComponent(t), "=").concat(encodeURIComponent("object" == typeof i ? JSON.stringify(i) : i))
                            }
                            );
                            return t.length ? "?".concat(t.join("&")) : ""
                        }(n)
                          , t = await fetch("/api/backEnd/admin", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                url: e,
                                method: s,
                                ...a
                            })
                        });
                        if (!t.ok)
                            throw Error("Request failed with status: ".concat(t.status));
                        let l = await t.json();
                        return o(l),
                        l
                    } catch (e) {
                        return o(null),
                        l(e instanceof Error && e.message || "Fetch error:"),
                        null
                    } finally {
                        t(!1)
                    }
                }
            }
        }
    },
    67638: function(e, t, i) {
        "use strict";
        i.d(t, {
            Y: function() {
                return o
            }
        });
        var n = i(11178);
        let o = e => (0,
        n.useMemo)( () => void 0 === e || !!e, [e])
    }
}, function(e) {
    e.O(0, [6894, 1697, 9173, 853, 5298, 1297, 8157, 6072, 9849, 7882, 6171, 3014, 7626, 5599, 173, 2924, 1887, 6922, 9635, 3074, 2060, 8080, 2002, 8560, 6676, 8942, 6544, 3768, 1744], function() {
        return e(e.s = 51319)
    }),
    _N_E = e.O()
}
]);
