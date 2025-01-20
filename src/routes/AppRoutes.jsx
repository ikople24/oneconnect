const AppRoutes = () => {
    return (
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="about" element={<About />} />
            </Route>
    
            {/* Private User */}
            <Route path="user" element={<Layout />}>
              <Route path="profile" element={<Profile />} />
            </Route>
    
            {/* Private Admin*/}
            <Route path="admin" element={<LayoutAdmin />}>
              <Route index element={<Dashboard />} />
              <Route path="manage" element={<Manage />} />
              <Route path="camping" element={<Camping />} />
            </Route>
    
            <Route path="*" element={<Notfound />} />
          </Routes>
        </BrowserRouter>
      );
    };
export default AppRoutes