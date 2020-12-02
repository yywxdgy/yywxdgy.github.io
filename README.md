## $\mathcal{Description:}$

有一棵点数为 N 的树，以点 1 为根，且树点有点权。然后有 M 个操作，分为三种：

- 操作 1 ：把某个节点 x 的点权增加 a 。
- 操作 2 ：把某个节点 x 为根的子树中所有点的点权都增加 a 。
- 操作 3 ：询问某个节点 x 到根的路径中所有点的点权和。

## $\mathcal{Solution:}$

这道题显然是个数据结构题，且操作简单，即使未学过较为高级的数据结构也能玩。

### $\mathbb{Tree\ Chain\ Subdivision}$

首先，这是一道重链剖分的板子题~~的弱化版的弱化版~~。

我们分析树剖的基本操作有链上操作、**子树操作**、（假）换根等等。

显然这题可以通过基本操作完美实现，具体树剖操作可参考[这里](https://www.cnblogs.com/zqytcl/p/13204760.html)

**单点修改** 也可通过区间修改实现，此为一弱化；

链上距离改为 **到根距离**，又为一弱化；

没有换根操作，再为一弱化；

总之挺好写的， 码风清奇但已经在克制了 QAQ。

$\mathbf{Code:}$

~~~cpp
#include <bits/stdc++.h>
#define int long long
const int N = 1e5 + 10;
using namespace std;
int n, m, a[N], Fa[N], d[N], si[N], hs[N], top[N], pr[N], tr[N], vs = 0;
struct Tree {
    int to[N << 1], net[N << 1], fl[N], len;
    inline void inc(int x, int y) { return to[++len] = y, net[len] = fl[x], fl[x] = len, void(); }
} T;
class Point { public:int sum, la; };
struct Segmentree {
    Point t[N << 2];
    #define ls p << 1
    #define rs ls | 1
    #define mid ((x + y) >> 1)
    #define Ls ls, x, mid
    #define Rs rs, mid + 1, y
    inline void Push(int p) { return t[p].sum = t[ls].sum + t[rs].sum, void(); }
    inline void Update(int p, int lson, int rson) {
        if (!t[p].la || lson <= 0 || rson <= 0) return void();
        t[ls].sum += lson * t[p].la, t[rs].sum += rson * t[p].la,
        t[ls].la += t[p].la, t[rs].la += t[p].la, t[p].la = 0;
    }
    inline void Build(int p, int x, int y) {
        return x == y ? (t[p].sum = pr[x], void()): (Build(Ls), Build(Rs), Push(p));
    }
    inline void Modify(int p, int x, int y, int l, int r, int v) {
        if (l > r || x > y || x > r || l > y) return void();
        if (l <= x && y <= r) return t[p].sum += (y - x + 1) * v, t[p].la += v, void();
        Update(p, mid - x + 1, y - mid);
        return Modify(Ls, l, r, v), Modify(Rs, l, r, v), Push(p);
    }
    inline int Ask(int p, int x, int y, int l, int r) {
        if (x > y || l > r || x > r || l > y) return 0;
        if (l <= x && y <= r) return t[p].sum;
        Update(p, mid - x + 1, y - mid);
        return Ask(Ls, l, r) + Ask(Rs, l, r);
    }
} Se;
inline int read() {
    int s = 0, w = 1; char c = getchar();
    for (; !isdigit(c) && c != '-'; c = getchar());
    if (c == '-') w = -1, c = getchar();
    for (; isdigit(c); c = getchar()) s = (s << 3) + (s << 1) + c - 48;
    return s * w;
}
inline void Dfs(int u, int fa) { Fa[u] = fa, d[u] = d[fa] + 1, si[u] = 1;
    for (int i = T.fl[u], v; v = T.to[i], i; i = T.net[i]) { if (v == fa) continue;
        Dfs(v, u), si[u] += si[v], (si[hs[u]] < si[v] ? hs[u] = v : 0);
    }
}
inline void Dfs_chain(int u, int k) {
    top[pr[tr[u] = ++vs] = u] = k, pr[vs] = a[u];
    if (!hs[u]) return void(); Dfs_chain(hs[u], k);
    for (int i = T.fl[u], v; v = T.to[i], i; i = T.net[i]) { if (v == Fa[u] || v == hs[u]) continue; Dfs_chain(v, v); }
}
inline int Ask(int x, int y) {
    int sum = 0;
    while (top[x] ^ top[y]) { if (d[top[x]] < d[top[y]]) swap(x, y);
        sum += Se.Ask(1, 1, n, tr[top[x]], tr[x]), x = Fa[top[x]];
    }
    if (d[x] < d[y]) swap(x, y);
    return sum += Se.Ask(1, 1, n, tr[y], tr[x]);
}
signed main(void) {
    n = read(), m = read(); for (int i = 1; i <= n; ++i) a[i] = read();
    for (int i = 1; i < n; ++i) { int x = read(), y = read(); T.inc(x, y), T.inc(y, x); }
    Dfs(1, 0), Dfs_chain(1, 1), Se.Build(1, 1, n);
    for (int i = 1; i <= m; ++i) {
        int opt = read();
        if (opt == 1) {
            int x = read(), y = read();
            Se.Modify(1, 1, n, tr[x], tr[x], y);
        }
        if (opt == 2) {
            int x = read(), y = read();
            Se.Modify(1, 1, n, tr[x], tr[x] + si[x] - 1, y);
        }
        if (opt == 3) {
            int x = read();
            printf("%lld\n", Ask(1, x));
        }
    }
    return 0;
}
~~~

### $\mathbb{Euler\ Sequence}$

欧拉序列，简单来说就是进子树记录一次，退子树标记一次的 DFS 序列。

我们借助欧拉序列，对子树进行操作，从而可得出答案。

对于每个点，我们使其子树内所有点的答案都加上当前点权，这显然可以维护到每个点的答案。

记录树状数组直接维护每个点的答案，这样一来**修改单点 x 点权**可转变为**修改 x 的子树内子树答案** 维护如下操作。

- 对于操作一： x, a

    可以直接在树状数组内将 x 所有子树答案加上 a.

- 对于操作二： x, a

    x 子树内每个点收到的影响是不同的，差异来源于深度，对于一个子树内点 y，答案应加上 $(dep_y - (dep_x - 1)) \times a$，分离为 $dep_y \times a - （dep_x - 1） \times a$.

    首先统一对子树内所有点加上 $-(dep_x - 1) \times a$， 再开第二个树状数组对子树内每个点 +a， 在询问时可直接 加上 $(BIT_2.Ask(x)\times dep_x)$ 拼凑成答案。

- 对于查询： x

    对于查询通过拼凑两个树状数组得到答案，即正常答案的 $BIT_1$ 与用于计算节点特殊性数据的 $BIT_2$ ，显而易见：
    $$
    \begin{aligned}
    ans &= BIT_2.Ask(x) \times dep_x + BIT_1.Ask(x) \\
    	&= (\sum a_?) \times dep_x +(-(\sum a_? \times dep_?)) \\
    	&= \sum (a_? \times (dep_x - dep_? + 1))
    \end{aligned}
    $$
    显然就是该点答案。

具体可结合代码理解。

$\mathbf{Code:}$

~~~cpp
#include <bits/stdc++.h>
#define int long long
const int N = 1e5 + 10;
using namespace std;
int n, m, a[N], d[N], vs = 0, in[N], out[N];
struct Tree { int to[N << 1], net[N << 1], fl[N], len;
    inline void inc(int x, int y) { return to[++len] = y, net[len] = fl[x], fl[x] = len, void(); }
} T;
struct BIT {
    int c[N << 1];
    inline void Build() {
        for (int i = 1; i <= n; ++i) {
            for (int x = in[i]; x <= n + n; x += x & (int)(-x)) c[x] += a[i];
            for (int x = out[i]; x <= n + n; x += x & (int)(-x)) c[x] -= a[i];
        }
    }
    inline void Modify(int i, int v) {
        for (int x = in[i]; x <= n + n; x += x & (int)(-x)) c[x] += v;
        for (int x = out[i]; x <= n + n; x += x & (int)(-x)) c[x] -= v;
    }
    inline int Ask(int i) { int sum = 0; for (int x = in[i]; x; x -= x & (int)(-x)) sum += c[x]; return sum; }
} B[2];
inline int read() {
    int s = 0, w = 1; char c = getchar();
    for (; !isdigit(c) && c != '-'; c = getchar());
    if (c == '-') w = -1, c = getchar();
    for (; isdigit(c); c = getchar()) s = (s << 3) + (s << 1) + c - 48;
    return s * w;
}
template <class T>
inline void write(T x) {
    (x < 0 ? x = ~x + 1, putchar('-') : 0), (x > 9 ? write(x / 10) : void()); return putchar(x % 10 + 48), void();
}
inline void Dfs(int u, int fa) {
    in[u] = ++vs; d[u] = d[fa] + 1;
    for (int i = T.fl[u], v; v = T.to[i], i; i = T.net[i]) { if (v == fa) continue; Dfs(v, u); }
    out[u] = ++vs;
}
signed main(void) {
    n = read(), m = read(); for (int i = 1; i <= n; ++i) a[i] = read();
    for (int i = 1; i < n; ++i) { int x = read(), y = read(); T.inc(x, y), T.inc(y, x); }
    Dfs(1, 0), B[0].Build();
    for (int i = 1; i <= m; ++i) {
        int opt = read();
        if (opt == 1) { int x = read(), y = read(); B[0].Modify(x, y); }
        if (opt == 2) { int x = read(), y = read(); B[0].Modify(x, -y * (d[x] - 1)), B[1].Modify(x, y); }
        if (opt == 3) { int x = read(), ans = B[1].Ask(x) * d[x] + B[0].Ask(x); write(ans), putchar(10); }
    }
    return 0;
}
~~~
