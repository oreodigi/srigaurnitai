package com.srigaurnitai.app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.CookieManager;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MainActivity extends Activity {
    private static final String BASE = "https://app.srigaurnitai.com";
    private static final int FILE_CHOOSER = 7001;
    private final int maroon = Color.rgb(114,11,50);
    private final int cream = Color.rgb(250,247,241);
    private final int ink = Color.rgb(35,27,31);
    private final int muted = Color.rgb(111,98,105);
    private final int gold = Color.rgb(209,157,55);
    private FrameLayout root;
    private LinearLayout shell;
    private FrameLayout drawer;
    private View scrim;
    private WebView webView;
    private WebView preloadView;
    private TextView preloadChip;
    private ValueCallback<Uri[]> filePathCallback;
    private String currentPath = "/";
    private boolean drawerOpen = false;
    private int preloadIndex = 0;
    private final Map<String, List<View>> navViews = new HashMap<>();

    private final NavItem[] primary = new NavItem[]{
        new NavItem("⌂","Home","/",0xff8e3d70),
        new NavItem("★","Contests","/contests",0xffcb7b21),
        new NavItem("◆","Events","/events",0xff3d789b),
        new NavItem("▦","Businesses","/businesses",0xff4f8a63),
        new NavItem("●","Account","/account",0xff6b5ca5)
    };
    private final NavItem[] drawerItems = new NavItem[]{
        new NavItem("⌂","Home","/",0xff8e3d70),
        new NavItem("★","Contests","/contests",0xffcb7b21),
        new NavItem("◆","Events","/events",0xff3d789b),
        new NavItem("▦","Businesses","/businesses",0xff4f8a63),
        new NavItem("♛","Winners","/winners",0xffad6e14),
        new NavItem("▤","Journal","/blog",0xff7d4f90),
        new NavItem("❝","Daily Quotes","/blog/category/daily-quotes",0xffb45275),
        new NavItem("▶","Public Videos","/videos",0xffbc4d4a),
        new NavItem("?","Support","/support",0xff427e8c),
        new NavItem("●","My Account","/account",0xff6b5ca5)
    };
    private final String[] preloadPaths = new String[]{
        "/","/contests","/events","/businesses","/winners","/blog","/blog/category/daily-quotes","/videos","/support","/account"
    };

    private static class NavItem {
        final String icon,label,path; final int color;
        NavItem(String icon,String label,String path,int color){this.icon=icon;this.label=label;this.path=path;this.color=color;}
    }

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(maroon);
        getWindow().setNavigationBarColor(Color.WHITE);
        if (Build.VERSION.SDK_INT >= 30) getWindow().setDecorFitsSystemWindows(false);
        buildUi(); configureWebView(); configurePreloader();
        if (Build.VERSION.SDK_INT >= 30) root.setOnApplyWindowInsetsListener((v,insets)->{
            android.graphics.Insets bars=insets.getInsets(WindowInsets.Type.systemBars());
            shell.setPadding(0,bars.top,0,bars.bottom);
            drawer.setPadding(0,bars.top,0,bars.bottom);
            return WindowInsets.CONSUMED;
        });
        String start="/";
        if(getIntent()!=null&&getIntent().getData()!=null){ Uri d=getIntent().getData(); start=d.getPath()==null?"/":d.getPath(); if(d.getQuery()!=null) start+="?"+d.getQuery(); }
        loadSection(start);
        if(isOnline()) root.postDelayed(this::startFirstInstallPreload,1800);
    }

    private int dp(int v){return Math.round(v*getResources().getDisplayMetrics().density);}
    private GradientDrawable rounded(int fill,float radius){GradientDrawable g=new GradientDrawable();g.setColor(fill);g.setCornerRadius(dp((int)radius));return g;}
    private void remember(String path,View v){ if(!navViews.containsKey(path))navViews.put(path,new ArrayList<>());navViews.get(path).add(v); }

    private View bottomNavItem(NavItem item){
        LinearLayout wrap=new LinearLayout(this); wrap.setOrientation(LinearLayout.VERTICAL); wrap.setGravity(Gravity.CENTER); wrap.setPadding(dp(3),dp(6),dp(3),dp(5)); wrap.setLayoutParams(new LinearLayout.LayoutParams(0,dp(76),1));
        TextView icon=new TextView(this); icon.setText(item.icon); icon.setTextSize(22); icon.setTypeface(Typeface.DEFAULT_BOLD); icon.setGravity(Gravity.CENTER); icon.setTextColor(Color.WHITE); icon.setBackground(rounded(item.color,18)); LinearLayout.LayoutParams ip=new LinearLayout.LayoutParams(dp(40),dp(40)); wrap.addView(icon,ip);
        TextView label=new TextView(this); label.setText(item.label); label.setTextSize(10.5f); label.setTextColor(ink); label.setGravity(Gravity.CENTER); label.setPadding(0,dp(3),0,0); wrap.addView(label,new LinearLayout.LayoutParams(-1,dp(22)));
        wrap.setOnClickListener(v->{closeDrawer();loadSection(item.path);}); remember(item.path,wrap); return wrap;
    }

    private View drawerNavItem(NavItem item){
        LinearLayout row=new LinearLayout(this); row.setOrientation(LinearLayout.HORIZONTAL); row.setGravity(Gravity.CENTER_VERTICAL); row.setPadding(dp(10),dp(7),dp(12),dp(7)); LinearLayout.LayoutParams rp=new LinearLayout.LayoutParams(-1,dp(62)); rp.setMargins(0,dp(3),0,dp(3)); row.setLayoutParams(rp);
        TextView icon=new TextView(this); icon.setText(item.icon); icon.setTextSize(23); icon.setTypeface(Typeface.DEFAULT_BOLD); icon.setGravity(Gravity.CENTER); icon.setTextColor(Color.WHITE); icon.setBackground(rounded(item.color,15)); row.addView(icon,new LinearLayout.LayoutParams(dp(46),dp(46)));
        LinearLayout copy=new LinearLayout(this);copy.setOrientation(LinearLayout.VERTICAL);copy.setGravity(Gravity.CENTER_VERTICAL);copy.setPadding(dp(14),0,0,0);TextView title=new TextView(this);title.setText(item.label);title.setTextSize(16);title.setTypeface(Typeface.DEFAULT,Typeface.BOLD);title.setTextColor(ink);copy.addView(title);TextView sub=new TextView(this);sub.setText(descriptionFor(item.path));sub.setTextSize(10.5f);sub.setTextColor(muted);copy.addView(sub);row.addView(copy,new LinearLayout.LayoutParams(0,-1,1));
        TextView chevron=new TextView(this);chevron.setText("›");chevron.setTextSize(24);chevron.setTextColor(0xffa89aa1);row.addView(chevron,new LinearLayout.LayoutParams(dp(28),-1));
        row.setOnClickListener(v->{closeDrawer();loadSection(item.path);}); remember(item.path,row); return row;
    }
    private String descriptionFor(String p){
        if(p.equals("/"))return "Latest community highlights"; if(p.equals("/contests"))return "Join and track competitions"; if(p.equals("/events"))return "Celebrations and publishing"; if(p.equals("/businesses"))return "Trusted community directory"; if(p.equals("/winners"))return "Recent selected participants"; if(p.equals("/blog"))return "Devotional articles and stories"; if(p.contains("daily-quotes"))return "Daily spiritual remembrance"; if(p.equals("/videos"))return "Watch community videos"; if(p.equals("/support"))return "Get help from our team"; return "Profile, submissions and updates";
    }

    private void buildUi(){
        root=new FrameLayout(this); root.setBackgroundColor(Color.WHITE);
        shell=new LinearLayout(this); shell.setOrientation(LinearLayout.VERTICAL); shell.setBackgroundColor(Color.WHITE);

        FrameLayout toolbar=new FrameLayout(this); toolbar.setBackgroundColor(cream); toolbar.setPadding(dp(12),0,dp(14),0); toolbar.setLayoutParams(new LinearLayout.LayoutParams(-1,dp(68))); toolbar.setElevation(dp(2));
        TextView menu=new TextView(this); menu.setText("☰"); menu.setTextSize(29); menu.setTextColor(ink); menu.setGravity(Gravity.CENTER); menu.setBackground(rounded(0x0a000000,16)); menu.setContentDescription("Open menu"); FrameLayout.LayoutParams mlp=new FrameLayout.LayoutParams(dp(50),dp(50),Gravity.START|Gravity.CENTER_VERTICAL); toolbar.addView(menu,mlp); menu.setOnClickListener(v->openDrawer());
        ImageView mark=new ImageView(this); mark.setImageResource(R.drawable.sgn_mark); mark.setScaleType(ImageView.ScaleType.CENTER_INSIDE); mark.setContentDescription("Sri Gaur Nitai"); toolbar.addView(mark,new FrameLayout.LayoutParams(dp(58),dp(58),Gravity.END|Gravity.CENTER_VERTICAL));
        preloadChip=new TextView(this); preloadChip.setText("Preparing offline content…"); preloadChip.setTextSize(10); preloadChip.setTextColor(maroon); preloadChip.setGravity(Gravity.CENTER); preloadChip.setBackground(rounded(0xfffff2d8,12)); preloadChip.setVisibility(View.GONE); FrameLayout.LayoutParams clp=new FrameLayout.LayoutParams(dp(156),dp(28),Gravity.CENTER); toolbar.addView(preloadChip,clp);

        FrameLayout content=new FrameLayout(this); content.setBackgroundColor(Color.WHITE); content.setLayoutParams(new LinearLayout.LayoutParams(-1,0,1)); webView=new WebView(this); content.addView(webView,new FrameLayout.LayoutParams(-1,-1)); preloadView=new WebView(this); preloadView.setVisibility(View.INVISIBLE); content.addView(preloadView,new FrameLayout.LayoutParams(dp(1),dp(1)));

        LinearLayout bottom=new LinearLayout(this); bottom.setOrientation(LinearLayout.HORIZONTAL); bottom.setGravity(Gravity.CENTER); bottom.setBackgroundColor(Color.WHITE); bottom.setPadding(dp(5),dp(3),dp(5),0); bottom.setElevation(dp(14)); for(NavItem i:primary)bottom.addView(bottomNavItem(i));
        shell.addView(toolbar); shell.addView(content); shell.addView(bottom); root.addView(shell,new FrameLayout.LayoutParams(-1,-1));

        scrim=new View(this); scrim.setBackgroundColor(0x73000000); scrim.setVisibility(View.GONE); scrim.setOnClickListener(v->closeDrawer()); root.addView(scrim,new FrameLayout.LayoutParams(-1,-1));
        drawer=new FrameLayout(this); drawer.setBackgroundColor(cream); drawer.setElevation(dp(24)); int w=Math.min(dp(350),(int)(getResources().getDisplayMetrics().widthPixels*.88f)); drawer.setLayoutParams(new FrameLayout.LayoutParams(w,-1,Gravity.START)); drawer.setTranslationX(-w);
        ScrollView scroller=new ScrollView(this); scroller.setFillViewport(true); scroller.setVerticalScrollBarEnabled(false); LinearLayout list=new LinearLayout(this); list.setOrientation(LinearLayout.VERTICAL); list.setPadding(dp(14),dp(10),dp(14),dp(20));
        LinearLayout drawerHead=new LinearLayout(this);drawerHead.setGravity(Gravity.CENTER_VERTICAL);drawerHead.setPadding(dp(8),dp(8),dp(8),dp(12));ImageView big=new ImageView(this);big.setImageResource(R.drawable.sgn_mark);big.setScaleType(ImageView.ScaleType.CENTER_INSIDE);drawerHead.addView(big,new LinearLayout.LayoutParams(dp(82),dp(82)));LinearLayout headCopy=new LinearLayout(this);headCopy.setOrientation(LinearLayout.VERTICAL);headCopy.setPadding(dp(10),0,0,0);TextView h1=new TextView(this);h1.setText("Explore");h1.setTextSize(21);h1.setTypeface(Typeface.DEFAULT,Typeface.BOLD);h1.setTextColor(maroon);headCopy.addView(h1);TextView h2=new TextView(this);h2.setText("Spirituality • Creativity • Community");h2.setTextSize(10.5f);h2.setTextColor(muted);headCopy.addView(h2);drawerHead.addView(headCopy,new LinearLayout.LayoutParams(0,-2,1));list.addView(drawerHead);
        TextView explore=new TextView(this); explore.setText("MAIN SECTIONS"); explore.setTextColor(muted); explore.setTypeface(Typeface.DEFAULT_BOLD); explore.setTextSize(10); explore.setPadding(dp(10),dp(2),dp(10),dp(4)); list.addView(explore); for(NavItem i:drawerItems)list.addView(drawerNavItem(i));
        TextView foot=new TextView(this);foot.setText("Offline-ready after first sync");foot.setGravity(Gravity.CENTER);foot.setTextSize(10);foot.setTextColor(muted);foot.setPadding(0,dp(14),0,dp(4));list.addView(foot);scroller.addView(list,new ScrollView.LayoutParams(-1,-2));drawer.addView(scroller,new FrameLayout.LayoutParams(-1,-1));root.addView(drawer); setContentView(root);
    }

    private void configureWebSettings(WebView w){
        WebSettings s=w.getSettings(); s.setJavaScriptEnabled(true); s.setDomStorageEnabled(true); s.setDatabaseEnabled(true); s.setAllowContentAccess(true); s.setAllowFileAccess(true); s.setMediaPlaybackRequiresUserGesture(false); s.setBuiltInZoomControls(false); s.setDisplayZoomControls(false); s.setSupportZoom(false); s.setCacheMode(WebSettings.LOAD_DEFAULT); s.setUserAgentString(s.getUserAgentString()+" SriGaurNitaiAndroid/3.0");
    }
    private void configureWebView(){
        configureWebSettings(webView); CookieManager cm=CookieManager.getInstance(); cm.setAcceptCookie(true); cm.setAcceptThirdPartyCookies(webView,true);
        webView.setWebViewClient(new WebViewClient(){
            @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest req){ Uri u=req.getUrl(); String host=u.getHost()==null?"":u.getHost(); if(("https".equals(u.getScheme())||"http".equals(u.getScheme()))&&(host.equals("app.srigaurnitai.com")||host.endsWith(".srigaurnitai.com")||host.endsWith("vercel.app"))){ String p=u.getPath()==null?"/":u.getPath(); if(u.getQuery()!=null)p+="?"+u.getQuery(); loadSection(p); return true;} try{startActivity(new Intent(Intent.ACTION_VIEW,u));}catch(Exception e){Toast.makeText(MainActivity.this,"Unable to open link",Toast.LENGTH_SHORT).show();} return true; }
            @Override public void onPageFinished(WebView view,String url){ injectAppChromeOverride(view); updateActiveNav(); if(isOnline()&&url.startsWith(BASE)){ File f=archiveFor(currentPath); view.saveWebArchive(f.getAbsolutePath(),false,value->{});} }
            @Override public void onReceivedError(WebView view,WebResourceRequest request,WebResourceError error){ if(request.isForMainFrame()&&!isOnline())loadOffline(currentPath); }
        });
        webView.setWebChromeClient(new WebChromeClient(){ @Override public boolean onShowFileChooser(WebView w,ValueCallback<Uri[]> cb,FileChooserParams p){ if(filePathCallback!=null)filePathCallback.onReceiveValue(null); filePathCallback=cb; try{startActivityForResult(p.createIntent(),FILE_CHOOSER);return true;}catch(Exception e){filePathCallback=null;return false;} } });
    }

    private void configurePreloader(){
        configureWebSettings(preloadView); preloadView.setWebViewClient(new WebViewClient(){
            @Override public void onPageFinished(WebView v,String url){
                if(preloadIndex>=preloadPaths.length)return; String path=preloadPaths[preloadIndex]; injectAppChromeOverride(v); File f=archiveFor(path); v.saveWebArchive(f.getAbsolutePath(),false,value->{ preloadIndex++; if(preloadIndex<preloadPaths.length){ preloadChip.setText("Offline sync "+preloadIndex+"/"+preloadPaths.length); v.loadUrl(BASE+preloadPaths[preloadIndex]); } else finishPreload(); });
            }
            @Override public void onReceivedError(WebView v,WebResourceRequest r,WebResourceError e){ if(r.isForMainFrame()){preloadIndex++;if(preloadIndex<preloadPaths.length)v.loadUrl(BASE+preloadPaths[preloadIndex]);else finishPreload();} }
        });
    }
    private void startFirstInstallPreload(){ SharedPreferences p=getSharedPreferences("sgn_app",MODE_PRIVATE); if(p.getBoolean("initial_preload_v3",false)||!isOnline())return; preloadIndex=0;preloadChip.setVisibility(View.VISIBLE);preloadChip.setText("Offline sync 0/"+preloadPaths.length);preloadView.loadUrl(BASE+preloadPaths[0]); }
    private void finishPreload(){ getSharedPreferences("sgn_app",MODE_PRIVATE).edit().putBoolean("initial_preload_v3",true).putLong("last_preload",System.currentTimeMillis()).apply(); preloadChip.setText("Offline ready ✓"); root.postDelayed(()->preloadChip.setVisibility(View.GONE),2200); }

    private void injectAppChromeOverride(WebView target){ String js="(function(){var s=document.getElementById('sgn-native-shell-style');if(!s){s=document.createElement('style');s.id='sgn-native-shell-style';s.innerHTML='.topbar,.bottom-nav,.site-footer,.context-support{display:none!important} body{padding-bottom:0!important} main{min-height:auto!important}';document.head.appendChild(s);}})();"; target.evaluateJavascript(js,null); }
    private File archiveFor(String path){ File dir=new File(getFilesDir(),"offline_pages"); if(!dir.exists())dir.mkdirs(); String key=path.replaceAll("[^a-zA-Z0-9]+","_"); if(key.length()==0)key="home"; return new File(dir,key+".mht"); }
    private void loadSection(String path){ if(path==null||path.length()==0)path="/"; currentPath=path; updateActiveNav(); if(isOnline()){webView.getSettings().setCacheMode(WebSettings.LOAD_DEFAULT);webView.loadUrl(BASE+path);}else loadOffline(path); }
    private void updateActiveNav(){
        for(Map.Entry<String,List<View>> e:navViews.entrySet()){boolean active=isPathActive(e.getKey());for(View v:e.getValue()){if(v instanceof LinearLayout){v.setBackground(active?rounded(0x11720b32,18):rounded(Color.TRANSPARENT,18));v.setAlpha(active?1f:.88f);}}}
    }
    private boolean isPathActive(String p){if(p.equals("/"))return currentPath.equals("/");return currentPath.startsWith(p);}
    private void loadOffline(String path){ File f=archiveFor(path); webView.getSettings().setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK); if(f.exists()){webView.loadUrl(Uri.fromFile(f).toString());Toast.makeText(this,"Offline • saved content",Toast.LENGTH_SHORT).show();}else{String html="<html><meta name='viewport' content='width=device-width,initial-scale=1'><body style='font-family:sans-serif;background:#faf7f1;color:#231b1f;padding:28px'><div style='max-width:560px;margin:50px auto;background:white;border-radius:20px;padding:24px;box-shadow:0 8px 30px #0001'><h2 style='color:#720b32'>You are offline</h2><p>This section has not finished syncing on this phone yet.</p><p>Connect once and the app automatically prepares the main sections for offline viewing.</p><p style='color:#6f6269;font-size:13px'>Native navigation remains available at all times.</p></div></body></html>";webView.loadDataWithBaseURL(BASE,html,"text/html","UTF-8",null);} }
    private boolean isOnline(){ try{ConnectivityManager cm=(ConnectivityManager)getSystemService(Context.CONNECTIVITY_SERVICE); if(Build.VERSION.SDK_INT>=23){Network n=cm.getActiveNetwork();if(n==null)return false;NetworkCapabilities c=cm.getNetworkCapabilities(n);return c!=null&&(c.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)||c.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)||c.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET));}return cm.getActiveNetworkInfo()!=null&&cm.getActiveNetworkInfo().isConnected();}catch(Exception e){return true;} }
    private void openDrawer(){if(drawerOpen)return;drawerOpen=true;scrim.setVisibility(View.VISIBLE);drawer.animate().translationX(0).setDuration(190).start();}
    private void closeDrawer(){if(!drawerOpen)return;drawerOpen=false;drawer.animate().translationX(-drawer.getWidth()).setDuration(190).withEndAction(()->scrim.setVisibility(View.GONE)).start();}
    @Override protected void onActivityResult(int requestCode,int resultCode,Intent data){super.onActivityResult(requestCode,resultCode,data);if(requestCode==FILE_CHOOSER&&filePathCallback!=null){Uri[] out=null;if(resultCode==RESULT_OK&&data!=null){if(data.getClipData()!=null){int c=data.getClipData().getItemCount();out=new Uri[c];for(int i=0;i<c;i++)out[i]=data.getClipData().getItemAt(i).getUri();}else if(data.getData()!=null)out=new Uri[]{data.getData()};}filePathCallback.onReceiveValue(out);filePathCallback=null;}}
    @Override public void onBackPressed(){if(drawerOpen){closeDrawer();return;}if(webView!=null&&webView.canGoBack())webView.goBack();else super.onBackPressed();}
    @Override protected void onDestroy(){if(preloadView!=null)preloadView.destroy();if(webView!=null)webView.destroy();super.onDestroy();}
}
